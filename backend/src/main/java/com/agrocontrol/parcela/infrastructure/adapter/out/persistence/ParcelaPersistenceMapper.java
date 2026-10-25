package com.agrocontrol.parcela.infrastructure.adapter.out.persistence;

import com.agrocontrol.parcela.domain.Parcela;

public final class ParcelaPersistenceMapper {

    private ParcelaPersistenceMapper() {
    }

    public static Parcela toDomain(ParcelaJpaEntity entity) {
        return Parcela.reconstruir(entity.getId(), entity.getPredioId(), entity.getCodigo(), entity.getAreaHa(),
                                   entity.getEstado());
    }

    public static ParcelaJpaEntity toEntity(Parcela p) {
        return new ParcelaJpaEntity(p.getId(), p.getPredioId(), p.getCodigo(), p.getAreaHa(), p.getEstado());
    }
}
