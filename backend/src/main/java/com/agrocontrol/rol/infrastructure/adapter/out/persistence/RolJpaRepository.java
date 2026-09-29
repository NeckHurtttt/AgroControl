package com.agrocontrol.rol.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RolJpaRepository extends JpaRepository<RolJpaEntity, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
}
