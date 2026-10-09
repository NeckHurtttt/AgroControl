package com.agrocontrol.rol.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RolJpaRepository extends JpaRepository<RolJpaEntity, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);

    // JPQL: navega el @OneToMany (r.usuarios) en lugar de cargar la colección en memoria
    @Query("select count(u) from RolJpaEntity r join r.usuarios u where r.id = :rolId")
    long contarUsuarios(@Param("rolId") Long rolId);
}
