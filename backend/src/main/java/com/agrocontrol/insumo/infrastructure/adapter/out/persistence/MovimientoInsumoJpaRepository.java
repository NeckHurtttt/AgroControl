package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import com.agrocontrol.insumo.domain.MovimientoInsumo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoInsumoJpaRepository extends JpaRepository<MovimientoInsumo, Long> {
    List<MovimientoInsumo> findByInsumoIdOrderByFechaDesc(Long insumoId);
}
