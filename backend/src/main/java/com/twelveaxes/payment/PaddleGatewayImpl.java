package com.twelveaxes.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
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
 * Paddle (Merchant of Record), para o exterior, em dolar. O servidor cria uma transacao com o hash do resultado e o codigo
 * da compra em {@code custom_data} e o endereco de volta em {@code checkout.url}; o comprador volta ao resultado com
 * {@code ?_ptxn=<transacao>}, o Paddle.js abre o pagamento por cima da pagina e, depois de pago, o site volta com
 * {@code ?pay=<transacao>}. A transacao e entao lida na Paddle. Nada fica guardado aqui: a Paddle e a fonte da verdade.
 */
public class PaddleGatewayImpl implements PaymentGateway {
    public static final String PRODUCTION_URL = "https://api.paddle.com";
    public static final String SANDBOX_URL = "https://sandbox-api.paddle.com";
    /** Quanto tempo uma resposta de "foi reembolsado?" vale: o relatorio e pedido varias vezes por visita. */
    private static final Duration REFUND_CACHE = Duration.ofMinutes(5);
    private static final Duration TIMEOUT = Duration.ofSeconds(10);
    private static final String USD = "USD";
    private static final Pattern TRANSACTION_ID = Pattern.compile("txn_[a-z0-9]{20,40}");
    /** Pagamento recebido: "paid" (capturado, ainda nao processado) e "completed" (processado). */
    private static final Set<String> PAID = Set.of("paid", "completed");
    /** Ajustes que devolvem o dinheiro. */
    private static final Set<String> RETURNED = Set.of("refund", "chargeback", "chargeback_warning");

    private record CachedRefund(boolean refunded, long checkedAtMillis) {
    }

    private final String apiKey;
    private final String priceId;
    private final String baseUrl;
    private final Clock clock;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(TIMEOUT).build();
    private final ObjectMapper json = new ObjectMapper();
    private final ConcurrentHashMap<String, CachedRefund> refundCache = new ConcurrentHashMap<>();

    /** Chave de sandbox ({@code pdl_sdbx_...}) fala com o sandbox; qualquer outra, com a producao. */
    public PaddleGatewayImpl(String apiKey, String priceId, Clock clock) {
        this(apiKey, priceId, apiKey.startsWith("pdl_sdbx_") ? SANDBOX_URL : PRODUCTION_URL, clock);
    }

    PaddleGatewayImpl(String apiKey, String priceId, String baseUrl, Clock clock) {
        this.apiKey = apiKey;
        this.priceId = priceId;
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.clock = clock;
    }

    /** O preco vem do cadastro da Paddle ({@code priceId}); {@code amount} so e conferido contra a moeda. */
    @Override
    public CheckoutSession create(String amount, String currency, String nonce, String vectorHash, String returnUrl, String lang) {
        if (!USD.equals(currency)) {
            throw new PaymentGatewayException("A Paddle so vende em dolar neste site", new IllegalArgumentException(currency));
        }
        ObjectNode body = json.createObjectNode();
        ObjectNode item = body.putArray("items").addObject();
        item.put("price_id", priceId);
        item.put("quantity", 1);
        body.putObject("custom_data").put("vector_hash", vectorHash).put("nonce", nonce);
        // O comprador volta ao proprio resultado (dominio aprovado na Paddle), com ?_ptxn=<transacao> acrescentado por ela.
        body.putObject("checkout").put("url", returnUrl);

        JsonNode data = send(post("/transactions", body.toString())).path("data");
        String id = data.path("id").asText("");
        String url = data.path("checkout").path("url").asText("");
        if (id.isBlank() || url.isBlank()) {
            throw new PaymentGatewayException("Resposta da Paddle sem endereco de pagamento", new IllegalStateException(data.toString()));
        }
        return new CheckoutSession(id, url);
    }

    /** A Paddle volta por {@code ?pay=}, nao por sessao. */
    @Override
    public Optional<PaidPayment> findBySession(String sessionId) {
        return Optional.empty();
    }

    /** {@code nonce} aqui e o numero da transacao ({@code txn_...}), o que o site devolve em {@code ?pay=}. */
    @Override
    public Optional<PaidPayment> findByNonce(String nonce) {
        if (nonce == null || !TRANSACTION_ID.matcher(nonce).matches()) {
            return Optional.empty();
        }
        JsonNode data;
        try {
            data = send(get("/transactions/" + nonce)).path("data");
        } catch (NotFoundException e) {
            return Optional.empty();
        }
        if (!PAID.contains(data.path("status").asText())) {
            return Optional.empty();
        }
        return Optional.of(new PaidPayment(data.path("id").asText(nonce), data.path("custom_data").path("vector_hash").asText(""), false));
    }

    @Override
    public boolean isRefunded(String paymentRef) {
        // Referencia que nao e da Paddle (Mercado Pago, cortesia, antigas): nao da para conferir aqui, nao bloqueia.
        if (paymentRef == null || !TRANSACTION_ID.matcher(paymentRef).matches()) {
            return false;
        }
        long now = clock.millis();
        CachedRefund cached = refundCache.get(paymentRef);
        if (cached != null && now - cached.checkedAtMillis() < REFUND_CACHE.toMillis()) {
            return cached.refunded();
        }
        String query = "/adjustments?transaction_id=" + URLEncoder.encode(paymentRef, StandardCharsets.UTF_8) + "&status=approved";
        boolean refunded = false;
        for (JsonNode adjustment : send(get(query)).path("data")) {
            if (RETURNED.contains(adjustment.path("action").asText())) {
                refunded = true;
                break;
            }
        }
        refundCache.put(paymentRef, new CachedRefund(refunded, now));
        return refunded;
    }

    private HttpRequest.Builder request(String path) {
        return HttpRequest.newBuilder(URI.create(baseUrl + path))
                .timeout(TIMEOUT)
                .header("Authorization", "Bearer " + apiKey)
                .header("Paddle-Version", "1")
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
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            int status = response.statusCode();
            if (status == 404) {
                throw new NotFoundException();
            }
            if (status < 200 || status >= 300) {
                throw new PaymentGatewayException("A Paddle respondeu HTTP " + status, new IOException(response.body()));
            }
            return json.readTree(response.body());
        } catch (IOException e) {
            throw new PaymentGatewayException("Nao foi possivel falar com a Paddle", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new PaymentGatewayException("Conexao com a Paddle interrompida", e);
        }
    }

    /** 404 da Paddle: o recurso nao existe (so {@link #findByNonce} trata como resposta normal). */
    private static final class NotFoundException extends PaymentGatewayException {
        NotFoundException() {
            super("Paddle: nao encontrado", new IOException("HTTP 404"));
        }
    }
}
