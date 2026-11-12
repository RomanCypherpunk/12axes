package com.twelveaxes.service;

import java.util.Base64;
import java.util.Optional;

/**
 * Chave curta dos valores completos no link (`f=`): 10 caracteres.
 * "1" (versao) + 8 caracteres base64url (8 espacos de 6 bits = 6 bytes, um por categoria, na ordem fixa das
 * categorias; 0 = sem valor, 1..63 = posicao do valor na categoria) + 1 caractere de verificacao.
 *
 * E codificacao, nao criptografia: os dados nao sao secretos e o navegador precisa ler. A verificacao so
 * detecta chave corrompida ou digitada errado (qualquer erro de um caractere; ver {@link #check}).
 */
public final class FullValuesKey {
    static final String VERSION = "1";
    static final int SLOTS = 8;
    static final int MAX_SLOT = 63;
    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    private static final int BODY_LENGTH = 8;
    private static final int BYTES = 6;

    private FullValuesKey() {
    }

    public static String encode(int[] slots) {
        if (slots == null || slots.length != SLOTS) {
            throw new IllegalArgumentException("A chave tem exatamente " + SLOTS + " espacos");
        }
        long bits = 0;
        for (int slot : slots) {
            if (slot < 0 || slot > MAX_SLOT) {
                throw new IllegalArgumentException("Espaco da chave fora de 0 a " + MAX_SLOT + ": " + slot);
            }
            bits = (bits << 6) | slot;
        }
        byte[] bytes = new byte[BYTES];
        for (int i = 0; i < BYTES; i++) {
            bytes[i] = (byte) (bits >> (8 * (BYTES - 1 - i)));
        }
        String body = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        return VERSION + body + check(body).orElseThrow();
    }

    /** Os 8 espacos, ou vazio se a chave e de outra versao, tem tamanho ou caractere invalido ou a verificacao nao confere. */
    public static Optional<int[]> decode(String key) {
        if (key == null || key.length() != 1 + BODY_LENGTH + 1 || !key.startsWith(VERSION)) {
            return Optional.empty();
        }
        String body = key.substring(1, 1 + BODY_LENGTH);
        Optional<Character> expected = check(body);
        if (expected.isEmpty() || key.charAt(key.length() - 1) != expected.get()) {
            return Optional.empty();
        }
        byte[] bytes = Base64.getUrlDecoder().decode(body);
        if (bytes.length != BYTES) {
            return Optional.empty();
        }
        long bits = 0;
        for (byte value : bytes) {
            bits = (bits << 8) | (value & 0xFF);
        }
        int[] slots = new int[SLOTS];
        for (int i = SLOTS - 1; i >= 0; i--) {
            slots[i] = (int) (bits & MAX_SLOT);
            bits >>= 6;
        }
        return Optional.of(slots);
    }

    /**
     * Verificacao do corpo: soma dos indices dos caracteres no alfabeto, com pesos impares (1, 3, 5, ...) modulo 64.
     * Peso impar e coprimo de 64, entao qualquer erro de UM caractere muda o resultado. Vazio se algum caractere
     * esta fora do alfabeto.
     */
    private static Optional<Character> check(String body) {
        int sum = 0;
        for (int i = 0; i < body.length(); i++) {
            int index = ALPHABET.indexOf(body.charAt(i));
            if (index < 0) {
                return Optional.empty();
            }
            sum += (2 * i + 1) * index;
        }
        return Optional.of(ALPHABET.charAt(sum % 64));
    }
}
