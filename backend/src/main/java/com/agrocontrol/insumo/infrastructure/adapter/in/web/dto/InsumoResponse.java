package com.agrocontrol.insumo.infrastructure.adapter.in.web.dto;

import com.agrocontrol.insumo.domain.Insumo;

import java.math.BigDecimal;

public record InsumoResponse(Long id, String nombre, String unidadMedida, BigDecimal stockActual) {
    public static InsumoResponse desde(Insumo insumo) {
        return new InsumoResponse(insumo.getId(), insumo.getNombre(), insumo.getUnidadMedida(), insumo.getStockActual());
    }
}
