package com.twelveaxes.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

/**
 * Mercado Pago (Checkout Pro). O servidor abre uma preferencia de pagamento com o codigo do resultado
 * ({@code external_reference}) e o hash do vetor, o comprador paga na pagina do Mercado Pago e volta para
 * {@code returnUrl?pay=<codigo>}; o pagamento e entao procurado por esse codigo. Nada fica guardado aqui: o Mercado
 * Pago e a fonte da verdade.
 */
public class MercadoPagoGatewayImpl implements PaymentGateway {
    public static final String DEFAULT_BASE_URL = "https://api.mercadopago.com";
    /** Quanto tempo uma resposta de "foi reembolsado?" vale: o relatorio e pedido varias vezes por visita. */
    private static final Duration REFUND_CACHE = Duration.ofMinutes(5);
    private static final Duration TIMEOUT = Duration.ofSeconds(10);
    private static final String BRL = "BRL";
    // Escapes unicode: o texto aparece na pagina de pagamento e no recibo, com acento.
    private static final String ITEM_TITLE = "12 Axes: Relatório Completo";
    private static final String ITEM_DESCRIPTION = "Acesso ao Relatório Completo do 12 Axes: análise dos 12 eixos, ranking e exportação em PDF e planilha.";
    private static final String ITEM_CATEGORY = "services";
    /** Pagamentos em que o dinheiro entrou (ainda que depois devolvido: o reembolso e conferido a parte). */
    private static final Set<String> SETTLED = Set.of("approved", "refunded", "charged_back");
    /** Pagamentos ainda no caminho (Pix aguardando, cartao em analise). */
    private static final Set<String> PENDING = Set.of("pending", "in_process", "authorized");
    private static final Set<String> RETURNED = Set.of("refunded", "charged_back");
    private static final Pattern PAYMENT_ID = Pattern.compile("\\d{1,20}");

    private record CachedRefund(boolean refunded, long checkedAtMillis) {
    }

    private final String accessToken;
    private final String pictureUrl;
    private final String baseUrl;
    private final Clock clock;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(TIMEOUT).build();
    private final ObjectMapper json = new ObjectMapper();
    private final ConcurrentHashMap<String, CachedRefund> refundCache = new ConcurrentHashMap<>();

    /** {@code pictureUrl}: endereco https publico da foto do produto na pagina de pagamento; vazio = sem foto. */
    public MercadoPagoGatewayImpl(String accessToken, String pictureUrl, Clock clock) {
        this(accessToken, DEFAULT_BASE_URL, pictureUrl, clock);
    }

    MercadoPagoGatewayImpl(String accessToken, String baseUrl, String pictureUrl, Clock clock) {
        this.accessToken = accessToken;
        this.pictureUrl = pictureUrl == null ? "" : pictureUrl.trim();
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.clock = clock;
    }

    @Override
    public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
        if (!BRL.equals(currency)) {
            throw new PaymentGatewayException("O Mercado Pago so vende em reais", new IllegalArgumentException(currency));
        }
        BigDecimal price;
        try {
            price = new BigDecimal(amount);
        } catch (NumberFormatException e) {
            throw new PaymentGatewayException("Preco invalido", e);
        }
        ObjectNode body = json.createObjectNode();
        ObjectNode item = body.putArray("items").addObject();
        // O hash do vetor vai tambem no item: o Mercado Pago devolve os itens no pagamento, o que garante a amarracao
        // mesmo que os metadados nao acompanhem a preferencia.
        item.put("id", vectorHash);
        item.put("title", ITEM_TITLE);
        item.put("description", ITEM_DESCRIPTION);
        item.put("category_id", ITEM_CATEGORY);
        if (!pictureUrl.isEmpty()) {
            item.put("picture_url", pictureUrl);
        }
        item.put("quantity", 1);
        item.put("unit_price", price);
        item.put("currency_id", BRL);
        // Sem boleto nem caixa eletronico (o boleto demora dias e custa mais que o relatorio permite), e sem parcelamento:
        // o Relatorio custa poucos reais e libera o acesso na hora.
        ObjectNode methods = body.putObject("payment_methods");
        ArrayNode excluded = methods.putArray("excluded_payment_types");
        excluded.addObject().put("id", "ticket");
        excluded.addObject().put("id", "atm");
        methods.put("installments", 1);
        body.put("external_reference", nonce);
        body.putObject("metadata").put("vector_hash", vectorHash).put("nonce", nonce);
        String paidReturn = withParam(returnUrl, "pay", nonce);
        ObjectNode backUrls = body.putObject("back_urls");
        backUrls.put("success", paidReturn);
        backUrls.put("pending", paidReturn);
        backUrls.put("failure", returnUrl);
        // O retorno automatico so e aceito para enderecos https; no teste local (http://localhost) a pessoa volta pelo botao.
        if (paidReturn.startsWith("https://")) {
            body.put("auto_return", "approved");
        }
        body.put("statement_descriptor", "12AXES");

        JsonNode response = send(post("/checkout/preferences", body.toString()));
        String id = response.path("id").asText("");
        String url = response.path("init_point").asText("");
        if (id.isBlank() || url.isBlank()) {
            throw new PaymentGatewayException("Resposta do Mercado Pago sem endereco de pagamento", new IllegalStateException(response.toString()));
        }
        return new CheckoutSession(id, url);
    }

    /** O Mercado Pago volta por {@code ?pay=}, nao por sessao. */
    @Override
    public Optional<PaidPayment> findBySession(String sessionId) {
        return Optional.empty();
    }

    @Override
    public Optional<PaidPayment> findByNonce(String nonce) {
        String query = "/v1/payments/search?external_reference=" + URLEncoder.encode(nonce, StandardCharsets.UTF_8)
                + "&sort=date_created&criteria=desc&limit=20";
        JsonNode results = send(get(query)).path("results");
        for (JsonNode payment : results) {
            if (SETTLED.contains(payment.path("status").asText())) {
                return Optional.of(new PaidPayment(payment.path("id").asText(), vectorHashOf(payment), false));
            }
        }
        for (JsonNode payment : results) {
            if (PENDING.contains(payment.path("status").asText())) {
                return Optional.of(new PaidPayment(payment.path("id").asText(), vectorHashOf(payment), true));
            }
        }
        return Optional.empty();
    }

    @Override
    public boolean isRefunded(String paymentRef) {
        // Referencia que nao e deste gateway (um pagamento antigo da Stripe, por exemplo): nao da para conferir, nao bloqueia.
        if (paymentRef == null || !PAYMENT_ID.matcher(paymentRef).matches()) {
            return false;
        }
        long now = clock.millis();
        CachedRefund cached = refundCache.get(paymentRef);
        if (cached != null && now - cached.checkedAtMillis() < REFUND_CACHE.toMillis()) {
            return cached.refunded();
        }
        JsonNode payment;
        try {
            payment = send(get("/v1/payments/" + paymentRef));
        } catch (NotFoundException e) {
            return false;
        }
        boolean refunded = RETURNED.contains(payment.path("status").asText())
                || payment.path("transaction_amount_refunded").asDouble(0) > 0;
        refundCache.put(paymentRef, new CachedRefund(refunded, now));
        return refunded;
    }

    private static String vectorHashOf(JsonNode payment) {
        String fromMetadata = payment.path("metadata").path("vector_hash").asText("");
        if (!fromMetadata.isBlank()) {
            return fromMetadata;
        }
        return payment.path("additional_info").path("items").path(0).path("id").asText("");
    }

    private HttpRequest.Builder request(String path) {
        return HttpRequest.newBuilder(URI.create(baseUrl + path))
                .timeout(TIMEOUT)
                .header("Authorization", "Bearer " + accessToken)
                .header("Accept", "application/json");
    }

    private HttpRequest get(String path) {
        return request(path).GET().build();
    }

    private HttpRequest post(String path, String body) {
        return request(path)
                // O charset explicito evita o Mercado Pago ler os acentos como Latin-1 ("RelatÃ³rio").
                .header("Content-Type", "application/json; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                .build();
    }

    private JsonNode send(HttpRequest request) {
        try {
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            int status = response.statusCode();
            if (status == 404) {
                throw new NotFoundException();
            }
            if (status < 200 || status >= 300) {
                throw new PaymentGatewayException("O Mercado Pago respondeu HTTP " + status, new IOException(response.body()));
            }
            return json.readTree(response.body());
        } catch (IOException e) {
            throw new PaymentGatewayException("Nao foi possivel falar com o Mercado Pago", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new PaymentGatewayException("Conexao com o Mercado Pago interrompida", e);
        }
    }

    /** 404 do Mercado Pago: o recurso nao existe (so {@link #isRefunded} trata como resposta normal). */
    private static final class NotFoundException extends PaymentGatewayException {
        NotFoundException() {
            super("Mercado Pago: nao encontrado", new IOException("HTTP 404"));
        }
    }

    // O nonce so tem letras, numeros, '-' e '_': nao ha o que codificar. Se a URL ja tem parametros, acrescenta com '&'.
    static String withParam(String url, String name, String value) {
        return url + (url.contains("?") ? "&" : "?") + name + "=" + value;
    }
}
