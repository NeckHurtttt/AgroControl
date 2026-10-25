package com.agrocontrol.labor.infrastructure.adapter.out.persistence;

import com.agrocontrol.labor.domain.AsignacionLabor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AsignacionLaborJpaRepository extends JpaRepository<AsignacionLabor, Long> {
    boolean existsByLaborIdAndUsuarioId(Long laborId, Long usuarioId);
}
