package com.twelveaxes.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ResultRequest(
        @NotEmpty List<@Valid SubmittedAnswer> answers,
        String variant
) {
    public ResultRequest(List<SubmittedAnswer> answers) {
        this(answers, "short");
    }
}
