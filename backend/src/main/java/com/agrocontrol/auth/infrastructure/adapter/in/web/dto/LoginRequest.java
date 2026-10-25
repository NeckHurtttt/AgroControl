package com.agrocontrol.auth.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "El email es obligatorio.")
        String email,

        @NotBlank(message = "La contraseña es obligatoria.")
        String password
) {
}
