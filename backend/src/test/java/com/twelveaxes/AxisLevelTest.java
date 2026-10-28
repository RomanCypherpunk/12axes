package com.twelveaxes;

import static org.assertj.core.api.Assertions.assertThat;

import com.twelveaxes.model.AxisLevel;
import org.junit.jupiter.api.Test;

class AxisLevelTest {
    @Test
    void centerIsBalancedOnBothSidesOfFifty() {
        assertThat(AxisLevel.of(50.0)).isEqualTo(new AxisLevel("balanced", "equilibrado"));
        assertThat(AxisLevel.of(57.4)).isEqualTo(new AxisLevel("balanced", "equilibrado"));
        assertThat(AxisLevel.of(42.6)).isEqualTo(new AxisLevel("balanced", "equilibrado"));
    }

    @Test
    void leaningStartsAtSevenAndAHalfPointsFromTheCenter() {
        assertThat(AxisLevel.of(57.5)).isEqualTo(new AxisLevel("left", "inclinado"));
        assertThat(AxisLevel.of(42.5)).isEqualTo(new AxisLevel("right", "inclinado"));
        assertThat(AxisLevel.of(72.4)).isEqualTo(new AxisLevel("left", "inclinado"));
        assertThat(AxisLevel.of(27.6)).isEqualTo(new AxisLevel("right", "inclinado"));
    }

    @Test
    void strongStartsAtTwentyTwoAndAHalfPointsFromTheCenter() {
        assertThat(AxisLevel.of(72.5)).isEqualTo(new AxisLevel("left", "forte"));
        assertThat(AxisLevel.of(27.5)).isEqualTo(new AxisLevel("right", "forte"));
        assertThat(AxisLevel.of(87.4)).isEqualTo(new AxisLevel("left", "forte"));
        assertThat(AxisLevel.of(12.6)).isEqualTo(new AxisLevel("right", "forte"));
    }

    @Test
    void veryStrongStartsAtThirtySevenAndAHalfPointsFromTheCenter() {
        assertThat(AxisLevel.of(87.5)).isEqualTo(new AxisLevel("left", "muito_forte"));
        assertThat(AxisLevel.of(12.5)).isEqualTo(new AxisLevel("right", "muito_forte"));
        assertThat(AxisLevel.of(100.0)).isEqualTo(new AxisLevel("left", "muito_forte"));
        assertThat(AxisLevel.of(0.0)).isEqualTo(new AxisLevel("right", "muito_forte"));
    }

    @Test
    void textKeyIsAxisIdPlusSideAndLevel() {
        assertThat(AxisLevel.of(80.0).textKey("estrutura")).isEqualTo("estrutura.left.forte");
        assertThat(AxisLevel.of(10.0).textKey("poder")).isEqualTo("poder.right.muito_forte");
        assertThat(AxisLevel.of(50.0).textKey("moral")).isEqualTo("moral.balanced");
    }
}
