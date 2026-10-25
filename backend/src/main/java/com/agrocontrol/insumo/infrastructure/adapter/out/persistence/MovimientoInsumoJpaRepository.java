package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import com.agrocontrol.insumo.domain.TipoMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

import java.util.List;

public interface MovimientoInsumoJpaRepository extends JpaRepository<MovimientoInsumoJpaEntity, Long> {
    List<MovimientoInsumoJpaEntity> findByInsumoIdOrderByFechaDesc(Long insumoId);

    List<MovimientoInsumoJpaEntity> findByTipoAndFechaGreaterThanEqualAndFechaLessThan(
            TipoMovimiento tipo, LocalDateTime desde, LocalDateTime hasta);
}
