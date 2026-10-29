package com.twelveaxes.payment;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * Token que prova que um resultado foi pago: sem banco de dados, so o segredo do servidor.
 *
 * <p>Formato: {@code base64url(payload) . base64url(hmac)}, com payload
 * {@code v2|hashDoVetor|referenciaDoPagamento|emitidoEm|expiraEm} (tempos em segundos). O hash amarra o token a um
 * unico resultado (os 12 eixos), e a referencia do pagamento permite reconferir na Stripe se houve reembolso.
 */
public class EntitlementToken {
    private static final String VERSION = "v2";
    private static final String HMAC = "HmacSHA256";
    private static final int MIN_SECRET_BYTES = 32;
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    /** O que o token afirma: qual pagamento o originou e quando foi emitido. */
    public record Claims(String paymentRef, Instant issuedAt) {
    }

    private final byte[] secret;
    private final Clock clock;

    public EntitlementToken(String secret, Clock clock) {
        byte[] bytes = secret == null ? new byte[0] : secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < MIN_SECRET_BYTES) {
            throw new IllegalArgumentException("O segredo do token precisa de pelo menos " + MIN_SECRET_BYTES + " bytes");
        }
        this.secret = bytes;
        this.clock = clock;
    }

    public String issue(String vectorHash, String paymentRef, Duration validity) {
        if (paymentRef == null || paymentRef.isBlank() || paymentRef.indexOf('|') >= 0) {
            throw new IllegalArgumentException("Referencia de pagamento invalida");
        }
        Instant now = clock.instant();
        String payload = String.join("|", VERSION, vectorHash, paymentRef,
                String.valueOf(now.getEpochSecond()), String.valueOf(now.plus(validity).getEpochSecond()));
        byte[] payloadBytes = payload.getBytes(StandardCharsets.UTF_8);
        return ENCODER.encodeToString(payloadBytes) + "." + ENCODER.encodeToString(sign(payloadBytes));
    }

    /** Verdadeiro so se a assinatura confere, o token nao expirou e ele foi emitido para este vetor. */
    public boolean isValidFor(String token, String vectorHash) {
        return verify(token, vectorHash).isPresent();
    }

    /** Os dados do token quando ele e valido para este vetor; vazio em qualquer outro caso. */
    public Optional<Claims> verify(String token, String vectorHash) {
        if (vectorHash == null) {
            return Optional.empty();
        }
        return parse(token, vectorHash);
    }

    /** Os dados do token quando a assinatura confere e ele nao expirou, de qualquer resultado (renovacao do acesso). */
    public Optional<Claims> verifyAnyVector(String token) {
        return parse(token, null);
    }

    // vectorHash nulo = aceita o token de qualquer resultado.
    private Optional<Claims> parse(String token, String vectorHash) {
        if (token == null) {
            return Optional.empty();
        }
        String[] parts = token.split("\\.", -1);
        if (parts.length != 2) {
            return Optional.empty();
        }
        byte[] payloadBytes;
        byte[] signature;
        try {
            payloadBytes = DECODER.decode(parts[0]);
            signature = DECODER.decode(parts[1]);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
        if (!MessageDigest.isEqual(sign(payloadBytes), signature)) {
            return Optional.empty();
        }
        String[] fields = new String(payloadBytes, StandardCharsets.UTF_8).split("\\|", -1);
        if (fields.length != 5 || !VERSION.equals(fields[0]) || (vectorHash != null && !vectorHash.equals(fields[1]))) {
            return Optional.empty();
        }
        try {
            Instant issuedAt = Instant.ofEpochSecond(Long.parseLong(fields[3]));
            Instant expiresAt = Instant.ofEpochSecond(Long.parseLong(fields[4]));
            if (clock.instant().isAfter(expiresAt)) {
                return Optional.empty();
            }
            return Optional.of(new Claims(fields[2], issuedAt));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    /**
     * SHA-256 em hex dos 12 valores arredondados a 1 casa, separados por virgula ("65.0,32.5,..."). O front calcula
     * o mesmo hash (frontend/src/utils/entitlement.ts): ruido abaixo de 1 casa nao muda o resultado de ninguem.
     */
    public static String hashOf(List<Double> leftPercents) {
        StringBuilder canonical = new StringBuilder();
        for (double value : leftPercents) {
            long tenths = Math.round(value * 10);
            if (canonical.length() > 0) {
                canonical.append(',');
            }
            canonical.append(tenths / 10).append('.').append(tenths % 10);
        }
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(canonical.toString().getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(e);
        }
    }

    private byte[] sign(byte[] payload) {
        try {
            Mac mac = Mac.getInstance(HMAC);
            mac.init(new SecretKeySpec(secret, HMAC));
            return mac.doFinal(payload);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(e);
        }
    }
}
