package com.twelveaxes.service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * Cache em memoria com tamanho maximo e descarte do menos usado recentemente.
 *
 * Os resultados do quiz sao deterministicos (mesmo vetor, idioma e religiao geram
 * sempre a mesma resposta) e os catalogos nao mudam depois de carregados, entao
 * repetir o calculo so gasta CPU. O tamanho e limitado para a memoria do plano
 * pequeno do Render nao crescer sem controle com vetores todos diferentes.
 */
public final class BoundedCache<K, V> {
    private final Map<K, V> entries;

    public BoundedCache(int maxEntries) {
        if (maxEntries < 1) {
            throw new IllegalArgumentException("maxEntries deve ser positivo");
        }
        this.entries = new LinkedHashMap<>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > maxEntries;
            }
        };
    }

    /**
     * Devolve o valor guardado ou calcula e guarda. O calculo roda fora do lock, entao duas
     * threads com a mesma chave nova podem calcular as duas; o resultado e o mesmo e o
     * custo extra e menor do que bloquear todas as requisicoes durante o calculo.
     */
    public V get(K key, Supplier<V> compute) {
        synchronized (entries) {
            V cached = entries.get(key);
            if (cached != null) {
                return cached;
            }
        }
        V value = compute.get();
        synchronized (entries) {
            entries.put(key, value);
        }
        return value;
    }

    public int size() {
        synchronized (entries) {
            return entries.size();
        }
    }
}
