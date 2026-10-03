package com.twelveaxes.service;

import java.util.Arrays;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Le o vetor de eixos da URL: percentuais separados por virgula, de 0 a 100. */
public final class AxisValuesParser {
    private AxisValuesParser() {
    }

    public static List<Double> parse(String values) {
        try {
            List<Double> parsed = Arrays.stream(values.split(","))
                    .map(String::trim)
                    .map(Double::parseDouble)
                    .toList();
            if (parsed.stream().anyMatch(value -> value.isNaN() || value < 0 || value > 100)) {
                throw new NumberFormatException("fora do intervalo 0-100");
            }
            return parsed;
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vetor de eixos inválido");
        }
    }
}
