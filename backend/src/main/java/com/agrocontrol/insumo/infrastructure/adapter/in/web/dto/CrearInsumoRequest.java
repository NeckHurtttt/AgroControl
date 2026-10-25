package com.agrocontrol.insumo.infrastructure.adapter.in.web.dto;

import com.agrocontrol.insumo.domain.CategoriaInsumo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

// También se usa para editar (PUT): mismos campos, el stock nunca se cambia a mano
public record CrearInsumoRequest(
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(max = 100, message = "El nombre admite como máximo 100 caracteres.")
        String nombre,

        @NotBlank(message = "La unidad de medida es obligatoria.")
        @Size(max = 20, message = "La unidad admite como máximo 20 caracteres.")
        String unidadMedida,

        // Opcional: sin categoría queda como OTRO
        CategoriaInsumo categoria,

        @PositiveOrZero(message = "El stock mínimo no puede ser negativo.")
        BigDecimal stockMinimo
) {
}
