package com.agrocontrol.predio.infra.web;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PredioRequest(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 100, message = "El nombre admite como máximo 100 caracteres.")
        String nombre,

        @Size(max = 200, message = "La ubicación admite como máximo 200 caracteres.")
        String ubicacion,

        @DecimalMin(value = "0.01", message = "El área debe ser mayor que cero.")
        @Digits(integer = 8, fraction = 2, message = "El área admite 8 enteros y 2 decimales.")
        BigDecimal areaHa,

        Boolean activo
) {
}
