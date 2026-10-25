package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoInsumoJpaRepository extends JpaRepository<MovimientoInsumoJpaEntity, Long> {
    List<MovimientoInsumoJpaEntity> findByInsumoIdOrderByFechaDesc(Long insumoId);
}
