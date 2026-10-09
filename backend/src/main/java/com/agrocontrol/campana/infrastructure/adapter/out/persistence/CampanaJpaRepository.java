package com.agrocontrol.campana.infrastructure.adapter.out.persistence;

import com.agrocontrol.campana.domain.Campana;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CampanaJpaRepository extends JpaRepository<Campana, Long> {
    List<Campana> findByParcelaIdOrderByFechaInicioDesc(Long parcelaId);
    boolean existsByParcelaId(Long parcelaId);
    boolean existsByParcelaIdAndEstadoNot(Long parcelaId, String estado);
}
