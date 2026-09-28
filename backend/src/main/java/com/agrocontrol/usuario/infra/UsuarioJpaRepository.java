package com.agrocontrol.usuario.infra;

import com.agrocontrol.usuario.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioJpaRepository extends JpaRepository<Usuario, Long> {
}
