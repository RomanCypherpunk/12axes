package com.twelveaxes.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpConnectTimeoutException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AbacatePay (API v2, reais, Pix e cartao). O produto (nome, foto e preco) mora no painel da AbacatePay; o servidor abre
 * um checkout desse produto com o codigo do resultado ({@code externalId}) e o hash do vetor ({@code metadata}), o
 * comprador paga na pagina da AbacatePay e volta para {@code returnUrl?pay=<codigo>}; o checkout e entao procurado por esse
 * codigo. Nada fica guardado aqui: a AbacatePay e a fonte da verdade.
 */
public class AbacatePayGatewayImpl implements PaymentGateway {
    private static final Logger LOG = LoggerFactory.getLogger(AbacatePayGatewayImpl.class);
    public static final String DEFAULT_BASE_URL = "https://api.abacatepay.com/v2";
    /** Quanto tempo uma resposta de "foi reembolsado?" vale: o relatorio e pedido varias vezes por visita. */
    private static final Duration REFUND_CACHE = Duration.ofMinutes(5);
    private static final Duration TIMEOUT = Duration.ofSeconds(10);
    private static final String BRL = "BRL";
    /** Checkouts em que o dinheiro entrou (ou o cupom de 100% foi resgatado); o reembolso e conferido a parte. */
    private static final Set<String> SETTLED = Set.of("PAID", "REDEEMED", "REFUNDED");
    private static final String PENDING = "PENDING";
    private static final Pattern CHECKOUT_ID = Pattern.compile("bill_[A-Za-z0-9]{1,64}");

    private record CachedRefund(boolean refunded, long checkedAtMillis) {
    }

    private final String apiKey;
    private final String productId;
    private final String baseUrl;
    private final Clock clock;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(TIMEOUT).build();
    private final ObjectMapper json = new ObjectMapper();
    private final ConcurrentHashMap<String, CachedRefund> refundCache = new ConcurrentHashMap<>();

    /** {@code productId}: o produto "Relatorio Completo" cadastrado no painel (prod_...). */
    public AbacatePayGatewayImpl(String apiKey, String productId, Clock clock) {
        this(apiKey, productId, DEFAULT_BASE_URL, clock);
    }

    AbacatePayGatewayImpl(String apiKey, String productId, String baseUrl, Clock clock) {
        this.apiKey = apiKey.trim();
        this.productId = productId.trim();
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.clock = clock;
    }

    /** O preco e o do produto no painel: {@code amount} so existe para a interface (o controlador o exige preenchido). */
    @Override
    public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
        return create(amount, currency, nonce, vectorHash, returnUrl, lang, null);
    }

    /**
     * Com {@code email}, o comprador e cadastrado na AbacatePay so com o e-mail (o unico campo obrigatorio) e o checkout sai
     * ja ligado a ele: a pagina de pagamento nao pergunta nome, telefone nem CPF, e o e-mail fica no painel para achar a compra.
     */
    @Override
    public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang, String email) {
        if (!BRL.equals(currency)) {
            throw new PaymentGatewayException("A AbacatePay so vende em reais", new IllegalArgumentException(currency));
        }
        ObjectNode body = json.createObjectNode();
        ObjectNode item = body.putArray("items").addObject();
        item.put("id", productId);
        item.put("quantity", 1);
        body.put("frequency", "ONE_TIME");
        // So Pix: a loja ainda nao tem cartao liberado na AbacatePay (sem isso ela recusa o checkout: "CARD is not available").
        body.putArray("methods").add("PIX");
        body.put("externalId", nonce);
        // O e-mail e o endereco do resultado ficam no pagamento: o webhook de "pago" os le daqui para mandar o acesso por e-mail
        // sem depender do navegador (o evento nao traz o metadata, entao o checkout e consultado de novo pela API).
        ObjectNode metadata = body.putObject("metadata").put("vector_hash", vectorHash).put("nonce", nonce).put("return_url", returnUrl);
        if (email != null && !email.isBlank()) {
            metadata.put("email", email.trim());
        }
        if (email != null && !email.isBlank()) {
            body.put("customerId", customerIdFor(email.trim()));
        }
        body.put("returnUrl", returnUrl);
        body.put("completionUrl", withParam(returnUrl, "pay", nonce));

        JsonNode data = send(post("/checkouts/create", body.toString())).path("data");
        String id = data.path("id").asText("");
        String url = data.path("url").asText("");
        if (id.isBlank() || url.isBlank()) {
            throw new PaymentGatewayException("Resposta da AbacatePay sem endereco de pagamento", new IllegalStateException(data.toString()));
        }
        // Sem as etapas de dados pessoais e de endereco (o relatorio e digital): o Pix usa o nome e o CPF que vem do banco, e o
        // cartao ainda pede so o CPF do titular. Apple Pay, Google Pay e boleto somem do checkout com essa opcao.
        return new CheckoutSession(id, withParam(withParam(url, "skip_customer", "true"), "skip_address", "true"));
    }

    /** Cadastra (ou recupera) o comprador pelo e-mail; so ele e enviado. */
    private String customerIdFor(String email) {
        ObjectNode body = json.createObjectNode();
        body.put("email", email);
        String id = send(post("/customers/create", body.toString())).path("data").path("id").asText("");
        if (id.isBlank()) {
            throw new PaymentGatewayException("Resposta da AbacatePay sem o id do cliente", new IllegalStateException(email));
        }
        return id;
    }

    /** A AbacatePay volta por {@code ?pay=}, nao por sessao. */
    @Override
    public Optional<PaidPayment> findBySession(String sessionId) {
        return Optional.empty();
    }

    @Override
    public Optional<PaidPayment> findByNonce(String nonce) {
        if (nonce == null || nonce.isBlank()) {
            return Optional.empty();
        }
        JsonNode checkouts = send(get("/checkouts/list?limit=20&externalId=" + URLEncoder.encode(nonce, StandardCharsets.UTF_8))).path("data");
        for (JsonNode checkout : checkouts) {
            if (SETTLED.contains(checkout.path("status").asText())) {
                return Optional.of(paymentOf(checkout, false));
            }
        }
        for (JsonNode checkout : checkouts) {
            if (PENDING.equals(checkout.path("status").asText())) {
                return Optional.of(paymentOf(checkout, true));
            }
        }
        return Optional.empty();
    }

    @Override
    public boolean isRefunded(String paymentRef) {
        // Referencia que nao e deste gateway (um pagamento do Mercado Pago ou da Paddle): nao da para conferir, nao bloqueia.
        if (paymentRef == null || !CHECKOUT_ID.matcher(paymentRef).matches()) {
            return false;
        }
        long now = clock.millis();
        CachedRefund cached = refundCache.get(paymentRef);
        if (cached != null && now - cached.checkedAtMillis() < REFUND_CACHE.toMillis()) {
            return cached.refunded();
        }
        JsonNode checkouts = send(get("/checkouts/list?limit=1&id=" + paymentRef)).path("data");
        boolean refunded = false;
        for (JsonNode checkout : checkouts) {
            refunded = "REFUNDED".equals(checkout.path("status").asText());
        }
        refundCache.put(paymentRef, new CachedRefund(refunded, now));
        return refunded;
    }

    private static PaidPayment paymentOf(JsonNode checkout, boolean pending) {
        JsonNode metadata = checkout.path("metadata");
        return new PaidPayment(checkout.path("id").asText(), metadata.path("vector_hash").asText(""), pending,
                textOrNull(metadata.path("email")), textOrNull(metadata.path("return_url")));
    }

    private static String textOrNull(JsonNode node) {
        String text = node.asText("");
        return text.isBlank() ? null : text;
    }

    private HttpRequest.Builder request(String path) {
        return HttpRequest.newBuilder(URI.create(baseUrl + path))
                .timeout(TIMEOUT)
                .header("Authorization", "Bearer " + apiKey)
                .header("Accept", "application/json");
    }

    private HttpRequest get(String path) {
        return request(path).GET().build();
    }

    private HttpRequest post(String path, String body) {
        return request(path)
                .header("Content-Type", "application/json; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                .build();
    }

    private JsonNode send(HttpRequest request) {
        try {
            HttpResponse<String> response;
            try {
                response = http.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            } catch (HttpConnectTimeoutException e) {
                // A conexao nao abriu a tempo: registra qual endereco responde e tenta mais uma vez.
                logReachability(request.uri().getHost());
                response = http.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            }
            int status = response.statusCode();
            if (status < 200 || status >= 300) {
                throw new PaymentGatewayException("A AbacatePay respondeu HTTP " + status, new IOException(response.body()));
            }
            return json.readTree(response.body());
        } catch (IOException e) {
            throw new PaymentGatewayException("Nao foi possivel falar com a AbacatePay", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new PaymentGatewayException("Conexao com a AbacatePay interrompida", e);
        }
    }

    /** Diagnostico de rede: para cada endereco do servidor, se a porta 443 abre (so roda depois de uma falha de conexao). */
    private static void logReachability(String host) {
        try {
            for (InetAddress address : InetAddress.getAllByName(host)) {
                long start = System.nanoTime();
                String result;
                try (Socket socket = new Socket()) {
                    socket.connect(new InetSocketAddress(address, 443), 4000);
                    result = "abre";
                } catch (IOException e) {
                    result = "falha: " + e.getClass().getSimpleName() + " " + e.getMessage();
                }
                LOG.warn("Diagnostico {} {}: {} ({} ms)", host, address.getHostAddress(), result, (System.nanoTime() - start) / 1_000_000);
            }
        } catch (IOException e) {
            LOG.warn("Diagnostico {}: nome nao resolvido ({})", host, e.getMessage());
        }
    }

    // O nonce so tem letras, numeros, '-' e '_': nao ha o que codificar. Se a URL ja tem parametros, acrescenta com '&'.
    static String withParam(String url, String name, String value) {
        return url + (url.contains("?") ? "&" : "?") + name + "=" + value;
    }
}
