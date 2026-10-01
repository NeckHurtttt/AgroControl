package com.agrocontrol.parcela.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

// El predio no se cambia: una parcela no se "muda" de fundo; se elimina y se crea en el otro.
public record ActualizarParcelaRequest(
        @NotBlank(message = "El código es obligatorio.")
        @Size(max = 30, message = "El código admite como máximo 30 caracteres.")
        String codigo,

        @DecimalMin(value = "0.01", message = "El área debe ser mayor que cero.")
        @Digits(integer = 8, fraction = 2, message = "El área admite 8 enteros y 2 decimales.")
        BigDecimal areaHa,

        @Pattern(regexp = "^(DISPONIBLE|EN_PRODUCCION|EN_DESCANSO)$",
                message = "El estado debe ser DISPONIBLE, EN_PRODUCCION o EN_DESCANSO.")
        String estado
) {
}
