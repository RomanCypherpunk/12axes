package com.twelveaxes.model;

public record AxisResult(
        String axisId,
        String label,
        String leftPole,
        String rightPole,
        double leftPercent,
        double rightPercent,
        String dominantPole,
        String intensity
) {
}
