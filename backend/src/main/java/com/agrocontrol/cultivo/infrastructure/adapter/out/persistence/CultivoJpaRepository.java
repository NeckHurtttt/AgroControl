package com.agrocontrol.cultivo.infrastructure.adapter.out.persistence;

import com.agrocontrol.cultivo.domain.Cultivo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CultivoJpaRepository extends JpaRepository<Cultivo, Long> {
    boolean existsByNombreIgnoreCase(String nombre);
}
