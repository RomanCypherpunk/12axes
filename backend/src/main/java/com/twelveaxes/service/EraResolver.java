package com.twelveaxes.service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Divide a historia nas seis eras da linha do tempo e descobre a era de um perfil.
 *
 * Personalidades entram pelo ano da MORTE (quem esta vivo, ou sem data, cai no seculo XXI);
 * paises historicos entram pelo primeiro ano do periodo e os atuais ficam no seculo XXI.
 * Anos a.C. sao negativos.
 */
public final class EraResolver {
    /** Uma era: [fromYear, toYear) com toYear nulo na ultima (aberta). */
    public record Era(String key, int fromYear, Integer toYear) {
        boolean contains(int year) {
            return year >= fromYear && (toYear == null || year < toYear);
        }
    }

    public static final List<Era> ERAS = List.of(
            new Era("antiguidade", Integer.MIN_VALUE, 476),
            new Era("medieval", 476, 1500),
            new Era("moderna", 1500, 1800),
            new Era("xix", 1800, 1900),
            new Era("xx", 1900, 2000),
            new Era("xxi", 2000, null));

    /** Ano usado para quem ainda vive: cai sempre na ultima era. */
    private static final int ALIVE_YEAR = 2000;

    private static final Pattern DIGITS = Pattern.compile("\\d+");

    private EraResolver() {
    }

    public static Era eraOfYear(int year) {
        return ERAS.stream().filter(era -> era.contains(year)).findFirst().orElseThrow();
    }

    /**
     * Ano da morte a partir do texto de {@code lifespan}: "1906–1982", "1873-1960", "384–322 a.C.",
     * "63 a.C.–14 d.C.", "c. 5–c. 67", "1964–" ou "1948–presente". Sem ano final, o perfil esta vivo.
     */
    public static int yearOfDeath(String lifespan) {
        if (lifespan == null) {
            return ALIVE_YEAR;
        }
        String[] parts = lifespan.split("[–—-]");
        if (parts.length < 2) {
            return ALIVE_YEAR;
        }
        String last = parts[parts.length - 1];
        return firstNumber(last).map(year -> last.contains("a.C.") ? -year : year).orElse(ALIVE_YEAR);
    }

    /**
     * Ano de inicio de um periodo ("c. 900–192 a.C.", "509–27 a.C.", "27 a.C.–476 d.C.", "1922–1991").
     * Todo o periodo em a.C. quando so a ponta final traz a marca.
     */
    public static Optional<Integer> startYear(String period) {
        if (period == null || period.isBlank()) {
            return Optional.empty();
        }
        String[] parts = period.split("–");
        boolean allBc = period.contains("a.C.") && !period.contains("d.C.");
        for (String part : parts) {
            Optional<Integer> year = firstNumber(part);
            if (year.isPresent()) {
                return year.map(value -> allBc || part.contains("a.C.") ? -value : value);
            }
        }
        return Optional.empty();
    }

    private static Optional<Integer> firstNumber(String text) {
        Matcher matcher = DIGITS.matcher(text);
        return matcher.find() ? Optional.of(Integer.parseInt(matcher.group())) : Optional.empty();
    }
}
