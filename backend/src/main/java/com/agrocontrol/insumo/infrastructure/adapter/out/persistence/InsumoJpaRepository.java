package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface InsumoJpaRepository extends JpaRepository<InsumoJpaEntity, Long> {

    // SELECT ... FOR UPDATE en PostgreSQL
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select i from InsumoJpaEntity i where i.id = :id")
    Optional<InsumoJpaEntity> findByIdParaActualizar(Long id);
}
