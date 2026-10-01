package com.agrocontrol.rol.infrastructure.adapter.out.persistence;

import com.agrocontrol.rol.domain.Rol;

public final class RolPersistenceMapper {

    private RolPersistenceMapper() {
    }

    public static Rol toDomain(RolJpaEntity entity) {
        return new Rol(entity.getId(), entity.getNombre(), entity.getDescripcion());
    }

    public static RolJpaEntity toEntity(Rol rol) {
        return new RolJpaEntity(rol.getId(), rol.getNombre(), rol.getDescripcion());
    }
}
