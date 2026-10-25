package com.agrocontrol.auditoria.infrastructure.adapter.out.persistence;

import com.agrocontrol.auditoria.domain.Auditoria;

public final class AuditoriaPersistenceMapper {

    private AuditoriaPersistenceMapper() {
    }

    public static Auditoria toDomain(AuditoriaJpaEntity entity) {
        return Auditoria.reconstruir(entity.getId(), entity.getUsuarioId(), entity.getEntidad(), entity.getIdEntidad(),
                entity.getAccion(), entity.getDetalle(), entity.getFecha());
    }

    public static AuditoriaJpaEntity toEntity(Auditoria a) {
        return new AuditoriaJpaEntity(a.getId(), a.getUsuarioId(), a.getEntidad(), a.getIdEntidad(), a.getAccion(),
                a.getDetalle(), a.getFecha());
    }
}
