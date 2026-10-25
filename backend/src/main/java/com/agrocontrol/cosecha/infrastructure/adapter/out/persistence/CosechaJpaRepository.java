package com.agrocontrol.cosecha.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CosechaJpaRepository extends JpaRepository<CosechaJpaEntity, Long> {
    List<CosechaJpaEntity> findByCampanaIdOrderByFechaDesc(Long campanaId);
}
