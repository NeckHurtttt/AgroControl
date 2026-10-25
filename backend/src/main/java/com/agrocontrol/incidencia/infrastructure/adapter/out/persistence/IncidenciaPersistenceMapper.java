package com.agrocontrol.incidencia.infrastructure.adapter.out.persistence;

import com.agrocontrol.incidencia.domain.Incidencia;

public final class IncidenciaPersistenceMapper {

    private IncidenciaPersistenceMapper() {
    }

    public static Incidencia toDomain(IncidenciaJpaEntity entity) {
        return Incidencia.reconstruir(entity.getId(), entity.getParcelaId(), entity.getCampanaId(), entity.getLaborId(),
                                      entity.getDescripcion(), entity.getUsuarioId(), entity.getFecha(),
                                      entity.getEstado(), entity.getResolucion(), entity.getResueltaEn());
    }

    public static IncidenciaJpaEntity toEntity(Incidencia i) {
        return new IncidenciaJpaEntity(i.getId(), i.getParcelaId(), i.getCampanaId(), i.getLaborId(),
                                       i.getDescripcion(), i.getUsuarioId(), i.getFecha(), i.getEstado(),
                                       i.getResolucion(), i.getResueltaEn());
    }
}
