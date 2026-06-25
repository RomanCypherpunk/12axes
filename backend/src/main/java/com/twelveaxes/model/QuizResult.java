package com.twelveaxes.model;

import java.util.List;

public record QuizResult(
        List<AxisResult> axes,
        IdeologyMatch topMatch,
        List<IdeologyMatch> matches,
        CountryMatch topCountryMatch
) {
}
