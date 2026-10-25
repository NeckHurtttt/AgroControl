package com.agrocontrol.labor.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AsignacionLaborJpaRepository extends JpaRepository<AsignacionLaborJpaEntity, Long> {
    boolean existsByLaborIdAndUsuarioId(Long laborId, Long usuarioId);
}
