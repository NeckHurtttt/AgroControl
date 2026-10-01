package com.agrocontrol.shared.web;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String mensaje,
        Map<String, String> campos
) {
}
