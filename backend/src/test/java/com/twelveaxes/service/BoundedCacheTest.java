package com.twelveaxes.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.Test;

class BoundedCacheTest {
    @Test
    void computesOnlyOncePerKey() {
        BoundedCache<String, Object> cache = new BoundedCache<>(10);
        AtomicInteger calls = new AtomicInteger();

        Object first = cache.get("a", () -> {
            calls.incrementAndGet();
            return new Object();
        });
        Object second = cache.get("a", () -> {
            calls.incrementAndGet();
            return new Object();
        });

        assertSame(first, second);
        assertEquals(1, calls.get());
    }

    @Test
    void evictsTheLeastRecentlyUsedEntryWhenFull() {
        BoundedCache<String, String> cache = new BoundedCache<>(2);
        AtomicInteger calls = new AtomicInteger();

        cache.get("a", () -> "A" + calls.incrementAndGet());
        cache.get("b", () -> "B" + calls.incrementAndGet());
        cache.get("a", () -> "unused"); // "a" volta a ser o mais recente
        cache.get("c", () -> "C" + calls.incrementAndGet()); // expulsa "b"

        assertEquals(2, cache.size());
        assertEquals("A1", cache.get("a", () -> "recomputed"));
        assertEquals("recomputed-b", cache.get("b", () -> "recomputed-b"));
    }

    @Test
    void rejectsNonPositiveSize() {
        assertThrows(IllegalArgumentException.class, () -> new BoundedCache<String, String>(0));
    }
}
