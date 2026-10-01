package com.agrocontrol.labor.infrastructure.adapter.in.web.dto;

import com.agrocontrol.insumo.domain.ConsumoLabor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ConsumoResponse(
        Long id,
        Long laborId,
        Long insumoId,
        BigDecimal cantidad,
        LocalDateTime fecha
) {
    public static ConsumoResponse desde(ConsumoLabor consumo) {
        return new ConsumoResponse(
                consumo.getId(),
                consumo.getLaborId(),
                consumo.getInsumoId(),
                consumo.getCantidad(),
                consumo.getFecha()
        );
    }
}
