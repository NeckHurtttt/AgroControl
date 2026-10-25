package com.agrocontrol.labor.infrastructure.adapter.out.persistence;

import com.agrocontrol.labor.domain.Labor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LaborJpaRepository extends JpaRepository<Labor, Long> {
    List<Labor> findByCampanaIdOrderByFechaPlanAsc(Long campanaId);

    // Agenda del operario (RN-05): solo las labores que tiene en asignacion_labor
    @Query("SELECT l FROM Labor l WHERE l.id IN "
            + "(SELECT a.laborId FROM AsignacionLabor a WHERE a.usuarioId = :usuarioId) ORDER BY l.fechaPlan ASC")
    List<Labor> findAsignadasA(@Param("usuarioId") Long usuarioId);
}
