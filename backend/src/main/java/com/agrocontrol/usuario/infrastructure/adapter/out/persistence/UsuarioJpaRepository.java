package com.agrocontrol.usuario.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioJpaEntity, Long> {
    boolean existsByEmailIgnoreCase(String email);
    Optional<UsuarioJpaEntity> findByEmailIgnoreCase(String email);
}
