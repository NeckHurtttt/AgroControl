package com.agrocontrol.parcela.infra.web;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ParcelaRequest(
        @NotNull(message = "Debe indicar el predio de la parcela.")
        Long predioId,

        @NotBlank(message = "El código es obligatorio.")
        @Size(max = 30, message = "El código admite como máximo 30 caracteres.")
        String codigo,

        @DecimalMin(value = "0.01", message = "El área debe ser mayor que cero.")
        @Digits(integer = 8, fraction = 2, message = "El área admite 8 enteros y 2 decimales.")
        BigDecimal areaHa
) {
}
