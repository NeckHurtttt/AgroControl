package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import com.agrocontrol.insumo.domain.ConsumoLabor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsumoLaborJpaRepository extends JpaRepository<ConsumoLabor, Long> {
    List<ConsumoLabor> findByLaborIdOrderByFechaAsc(Long laborId);
}
