package com.agrocontrol.labor.infrastructure.adapter.in.web.dto;

import com.agrocontrol.labor.domain.AsignacionLabor;

import java.time.LocalDateTime;

public record AsignacionResponse(
        Long id,
        Long laborId,
        Long usuarioId,
        LocalDateTime asignadoEn
) {
    public static AsignacionResponse desde(AsignacionLabor asignacion) {
        return new AsignacionResponse(
                asignacion.getId(),
                asignacion.getLaborId(),
                asignacion.getUsuarioId(),
                asignacion.getAsignadoEn()
        );
    }
}
