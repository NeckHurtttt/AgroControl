package com.agrocontrol.cultivo.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CrearCultivoRequest(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 80, message = "El nombre admite como máximo 80 caracteres.")
        String nombre,

        @Positive(message = "El ciclo debe ser mayor que cero.")
        Integer cicloDias
) {
}
