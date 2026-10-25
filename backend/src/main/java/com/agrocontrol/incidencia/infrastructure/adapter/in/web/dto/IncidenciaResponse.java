package com.agrocontrol.incidencia.infrastructure.adapter.in.web.dto;

import com.agrocontrol.incidencia.domain.EstadoIncidencia;
import com.agrocontrol.incidencia.domain.Incidencia;

import java.time.LocalDateTime;

public record IncidenciaResponse(
        Long id,
        Long parcelaId,
        Long campanaId,
        Long laborId,
        String descripcion,
        Long usuarioId,
        LocalDateTime fecha,
        EstadoIncidencia estado,
        String resolucion,
        LocalDateTime resueltaEn
) {
    public static IncidenciaResponse desde(Incidencia incidencia) {
        return new IncidenciaResponse(
                incidencia.getId(),
                incidencia.getParcelaId(),
                incidencia.getCampanaId(),
                incidencia.getLaborId(),
                incidencia.getDescripcion(),
                incidencia.getUsuarioId(),
                incidencia.getFecha(),
                incidencia.getEstado(),
                incidencia.getResolucion(),
                incidencia.getResueltaEn()
        );
    }
}
