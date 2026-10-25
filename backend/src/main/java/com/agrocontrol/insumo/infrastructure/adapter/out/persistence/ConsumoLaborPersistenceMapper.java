package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import com.agrocontrol.insumo.domain.ConsumoLabor;

public final class ConsumoLaborPersistenceMapper {

    private ConsumoLaborPersistenceMapper() {
    }

    public static ConsumoLabor toDomain(ConsumoLaborJpaEntity entity) {
        return ConsumoLabor.reconstruir(entity.getId(), entity.getLaborId(), entity.getInsumoId(), entity.getCantidad(),
                                        entity.getFecha());
    }

    public static ConsumoLaborJpaEntity toEntity(ConsumoLabor c) {
        return new ConsumoLaborJpaEntity(c.getId(), c.getLaborId(), c.getInsumoId(), c.getCantidad(), c.getFecha());
    }
}
