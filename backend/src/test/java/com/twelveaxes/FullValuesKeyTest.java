package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.service.FullValuesKey;
import com.twelveaxes.service.FullValuesService;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;

/** Chave curta `f` do link: o codec puro e a traducao dela para valores do catalogo. */
class FullValuesKeyTest {
    @Test
    void roundTripsEmptyAndFilledSlots() {
        int[] empty = {0, 0, 0, 0, 0, 0, 0, 0};
        int[] filled = {1, 63, 0, 5, 0, 0, 0, 2};
        assertThat(FullValuesKey.decode(FullValuesKey.encode(empty))).hasValue(empty);
        assertThat(FullValuesKey.decode(FullValuesKey.encode(filled))).hasValue(filled);
    }

    @Test
    void keyHasTenCharactersAndStartsWithTheVersion() {
        String key = FullValuesKey.encode(new int[] {1, 63, 0, 5, 0, 0, 0, 2});
        assertThat(key).hasSize(10).startsWith("1").matches("[A-Za-z0-9_-]{10}");
    }

    @Test
    void rejectsCorruptedKeys() {
        String key = FullValuesKey.encode(new int[] {1, 63, 0, 5, 0, 0, 0, 2});
        char last = key.charAt(9);
        String wrongCheck = key.substring(0, 9) + (last == 'A' ? 'B' : 'A');
        String wrongBody = key.substring(0, 3) + (key.charAt(3) == 'A' ? 'B' : 'A') + key.substring(4);
        assertThat(FullValuesKey.decode(wrongCheck)).isEmpty();
        assertThat(FullValuesKey.decode(wrongBody)).isEmpty();
        assertThat(FullValuesKey.decode("2" + key.substring(1))).isEmpty();
        assertThat(FullValuesKey.decode(key.substring(0, 9))).isEmpty();
        assertThat(FullValuesKey.decode(key + "A")).isEmpty();
        assertThat(FullValuesKey.decode(key.substring(0, 5) + "=" + key.substring(6))).isEmpty();
        assertThat(FullValuesKey.decode(key.substring(0, 5) + " " + key.substring(6))).isEmpty();
        assertThat(FullValuesKey.decode("")).isEmpty();
        assertThat(FullValuesKey.decode(null)).isEmpty();
    }

    @Test
    void anySingleCharacterErrorIsDetected() {
        String key = FullValuesKey.encode(new int[] {1, 63, 0, 5, 0, 0, 0, 2});
        String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        for (int position = 1; position < key.length(); position++) {
            for (char replacement : alphabet.toCharArray()) {
                if (replacement == key.charAt(position)) {
                    continue;
                }
                String broken = key.substring(0, position) + replacement + key.substring(position + 1);
                assertThat(FullValuesKey.decode(broken)).as("posicao %d trocada por %s", position, replacement).isEmpty();
            }
        }
    }

    @Test
    void serviceEncodesChosenValuesByTheirPositionInTheCatalog() {
        FullValuesService service = FullValuesServiceTest.service(FullValuesServiceTest.POLITICA);
        Optional<String> key = service.encodeKey(Map.of("politica", "democracia"));
        // democracia e o 2o valor da Politica: indice 2 no primeiro espaco
        assertThat(key).hasValue(FullValuesKey.encode(new int[] {2, 0, 0, 0, 0, 0, 0, 0}));
        assertThat(service.decodeKey(key.orElseThrow())).hasValue(Map.of("politica", "democracia"));
        assertThat(service.encodeKey(Map.of())).isEmpty();
    }

    @Test
    void serviceFallsBackToEmptyWhenAnIndexIsNotInTheCatalog() {
        FullValuesService service = FullValuesServiceTest.service(FullValuesServiceTest.POLITICA);
        // a Politica so tem 3 valores; indice 63 nao existe
        assertThat(service.decodeKey(FullValuesKey.encode(new int[] {63, 0, 0, 0, 0, 0, 0, 0}))).isEmpty();
        // categoria pendente (tecnologia) nao tem valor algum
        assertThat(service.decodeKey(FullValuesKey.encode(new int[] {0, 1, 0, 0, 0, 0, 0, 0}))).isEmpty();
        // chave toda zerada = nenhum valor: tambem cai no comportamento sem chave
        assertThat(service.decodeKey(FullValuesKey.encode(new int[8]))).isEmpty();
        assertThat(service.decodeKey("lixo")).isEmpty();
    }
}
