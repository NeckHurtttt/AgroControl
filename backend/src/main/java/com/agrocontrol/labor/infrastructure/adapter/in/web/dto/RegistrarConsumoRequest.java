package com.agrocontrol.labor.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RegistrarConsumoRequest(
        @NotNull(message = "Debe indicar el insumo.")
        Long insumoId,

        @NotNull(message = "La cantidad es obligatoria.")
        @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor que cero.")
        @Digits(integer = 10, fraction = 2, message = "La cantidad admite 10 enteros y 2 decimales.")
        BigDecimal cantidad,

        @NotNull(message = "Debe indicar quién registra el consumo.")
        Long usuarioId
) {
}
