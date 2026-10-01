package com.agrocontrol.campana.infrastructure.adapter.in.web.dto;

import com.agrocontrol.campana.domain.Campana;

import java.time.LocalDate;

public record CampanaResponse(
        Long id,
        Long parcelaId,
        Long cultivoId,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        String estado
) {
    public static CampanaResponse desde(Campana campana) {
        return new CampanaResponse(
                campana.getId(),
                campana.getParcelaId(),
                campana.getCultivoId(),
                campana.getFechaInicio(),
                campana.getFechaFin(),
                campana.getEstado()
        );
    }
}
