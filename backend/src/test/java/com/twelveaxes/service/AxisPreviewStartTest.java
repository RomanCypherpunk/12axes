package com.twelveaxes.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

/** O convite da compra mostra so o comeco do texto de um eixo: nunca o texto inteiro. */
class AxisPreviewStartTest {
    @Test
    void cutsAtAWholeWordAndNeverReturnsMoreThanHalfOfTheText() {
        String text = "Você aceita que uma liderança forte decida com menos amarras do que a democracia plena permite, desde que haja legitimidade.";

        String start = PremiumReportService.startOf(text);

        assertThat(start).isEqualTo("Você aceita que uma liderança forte decida com menos");
        assertThat(text).startsWith(start);
        assertThat(start.length()).isLessThanOrEqualTo(text.length() / 2);
    }

    @Test
    void aShortTextGivesAShortStart() {
        String start = PremiumReportService.startOf("Você tende a preferir o centro e a moderação sempre.");

        assertThat(start).isNotNull();
        assertThat(start.length()).isLessThanOrEqualTo(26);
    }

    @Test
    void noTextOrNoWholeWordGivesNothing() {
        assertThat(PremiumReportService.startOf(null)).isNull();
        assertThat(PremiumReportService.startOf("   ")).isNull();
        assertThat(PremiumReportService.startOf("Palavralongademais")).isNull();
    }
}
