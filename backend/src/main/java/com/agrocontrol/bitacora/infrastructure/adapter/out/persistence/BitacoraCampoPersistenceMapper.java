package com.agrocontrol.bitacora.infrastructure.adapter.out.persistence;

import com.agrocontrol.bitacora.domain.BitacoraCampo;

public final class BitacoraCampoPersistenceMapper {

    private BitacoraCampoPersistenceMapper() {
    }

    public static BitacoraCampo toDomain(BitacoraCampoJpaEntity entity) {
        return BitacoraCampo.reconstruir(entity.getId(), entity.getLaborId(), entity.getUsuarioId(),
                entity.getObservacion(), entity.getFecha());
    }

    public static BitacoraCampoJpaEntity toEntity(BitacoraCampo b) {
        return new BitacoraCampoJpaEntity(b.getId(), b.getLaborId(), b.getUsuarioId(), b.getObservacion(), b.getFecha());
    }
}
