package com.agrocontrol.insumo.infrastructure.adapter.in.web.dto;

import com.agrocontrol.insumo.domain.MovimientoInsumo;
import com.agrocontrol.insumo.domain.TipoMovimiento;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MovimientoResponse(
        Long id,
        Long insumoId,
        TipoMovimiento tipo,
        BigDecimal cantidad,
        String motivo,
        Long usuarioId,
        LocalDateTime fecha
) {
    public static MovimientoResponse desde(MovimientoInsumo movimiento) {
        return new MovimientoResponse(
                movimiento.getId(),
                movimiento.getInsumoId(),
                movimiento.getTipo(),
                movimiento.getCantidad(),
                movimiento.getMotivo(),
                movimiento.getUsuarioId(),
                movimiento.getFecha()
        );
    }
}
