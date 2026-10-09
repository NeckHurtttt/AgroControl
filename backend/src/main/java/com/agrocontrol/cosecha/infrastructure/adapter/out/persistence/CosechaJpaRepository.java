package com.agrocontrol.cosecha.infrastructure.adapter.out.persistence;

import com.agrocontrol.cosecha.domain.Cosecha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CosechaJpaRepository extends JpaRepository<Cosecha, Long> {
    List<Cosecha> findByCampanaIdOrderByFechaDesc(Long campanaId);
}
