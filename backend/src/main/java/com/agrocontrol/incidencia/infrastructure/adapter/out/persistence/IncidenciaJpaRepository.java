package com.agrocontrol.incidencia.infrastructure.adapter.out.persistence;

import com.agrocontrol.incidencia.domain.Incidencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidenciaJpaRepository extends JpaRepository<Incidencia, Long> {
    List<Incidencia> findByParcelaIdOrderByFechaDesc(Long parcelaId);
}
