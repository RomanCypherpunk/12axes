package com.twelveaxes.exception;

import java.time.Instant;
import org.springframework.http.HttpStatus;

public record ApiError(Instant timestamp, int status, String error, String message) {
    public static ApiError of(HttpStatus status, String message) {
        return new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message);
    }
}
