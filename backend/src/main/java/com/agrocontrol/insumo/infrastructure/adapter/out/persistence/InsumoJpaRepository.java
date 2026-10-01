package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import com.agrocontrol.insumo.domain.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InsumoJpaRepository extends JpaRepository<Insumo, Long> {
}
