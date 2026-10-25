package com.agrocontrol.incidencia.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidenciaJpaRepository extends JpaRepository<IncidenciaJpaEntity, Long> {
    List<IncidenciaJpaEntity> findByParcelaIdOrderByFechaDesc(Long parcelaId);
}
