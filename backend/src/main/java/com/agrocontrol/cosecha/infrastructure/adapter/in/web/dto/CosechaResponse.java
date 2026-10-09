package com.agrocontrol.cosecha.infrastructure.adapter.in.web.dto;

import com.agrocontrol.cosecha.domain.Cosecha;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CosechaResponse(
        Long id,
        Long campanaId,
        BigDecimal cantidad,
        String unidadMedida,
        LocalDate fecha,
        Long usuarioId
) {
    public static CosechaResponse desde(Cosecha cosecha) {
        return new CosechaResponse(
                cosecha.getId(),
                cosecha.getCampanaId(),
                cosecha.getCantidad(),
                cosecha.getUnidadMedida(),
                cosecha.getFecha(),
                cosecha.getUsuarioId()
        );
    }
}
