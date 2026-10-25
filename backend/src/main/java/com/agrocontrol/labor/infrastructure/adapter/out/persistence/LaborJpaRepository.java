package com.agrocontrol.labor.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LaborJpaRepository extends JpaRepository<LaborJpaEntity, Long> {
    List<LaborJpaEntity> findByCampanaIdOrderByFechaPlanAsc(Long campanaId);

    // Agenda del operario (RN-05): solo las labores que tiene en asignacion_labor
    @Query("SELECT l FROM LaborJpaEntity l WHERE l.id IN "
            + "(SELECT a.laborId FROM AsignacionLaborJpaEntity a WHERE a.usuarioId = :usuarioId) ORDER BY l.fechaPlan ASC")
    List<LaborJpaEntity> findAsignadasA(@Param("usuarioId") Long usuarioId);
}
