package com.agrocontrol.predio.infrastructure.adapter.out.persistence;

import com.agrocontrol.predio.domain.Predio;

public final class PredioPersistenceMapper {

    private PredioPersistenceMapper() {
    }

    public static Predio toDomain(PredioJpaEntity entity) {
        return Predio.reconstruir(entity.getId(), entity.getNombre(), entity.getUbicacion(), entity.getAreaHa(),
                                  entity.isActivo());
    }

    public static PredioJpaEntity toEntity(Predio p) {
        return new PredioJpaEntity(p.getId(), p.getNombre(), p.getUbicacion(), p.getAreaHa(), p.isActivo());
    }
}
