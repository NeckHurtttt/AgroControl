package com.agrocontrol.labor.infrastructure.adapter.out.persistence;

import com.agrocontrol.labor.domain.AsignacionLabor;

public final class AsignacionLaborPersistenceMapper {

    private AsignacionLaborPersistenceMapper() {
    }

    public static AsignacionLabor toDomain(AsignacionLaborJpaEntity entity) {
        return AsignacionLabor.reconstruir(entity.getId(), entity.getLaborId(), entity.getUsuarioId(),
                                           entity.getAsignadoEn());
    }

    public static AsignacionLaborJpaEntity toEntity(AsignacionLabor a) {
        return new AsignacionLaborJpaEntity(a.getId(), a.getLaborId(), a.getUsuarioId(), a.getAsignadoEn());
    }
}
