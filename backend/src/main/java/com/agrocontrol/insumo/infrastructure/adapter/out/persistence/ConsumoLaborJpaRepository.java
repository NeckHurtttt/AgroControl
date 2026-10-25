package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsumoLaborJpaRepository extends JpaRepository<ConsumoLaborJpaEntity, Long> {
    List<ConsumoLaborJpaEntity> findByLaborIdOrderByFechaAsc(Long laborId);
}
