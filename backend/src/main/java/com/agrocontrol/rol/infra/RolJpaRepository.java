package com.agrocontrol.rol.infra;

import com.agrocontrol.rol.domain.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RolJpaRepository extends JpaRepository<Rol, Long> {
}
