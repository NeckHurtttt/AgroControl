package com.agrocontrol.auditoria.infrastructure.adapter.out.persistence;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuditoriaJpaRepository extends JpaRepository<AuditoriaJpaEntity, Long> {

    @Query("SELECT a FROM AuditoriaJpaEntity a "
            + "WHERE (:entidad IS NULL OR a.entidad = :entidad) AND (:idEntidad IS NULL OR a.idEntidad = :idEntidad) "
            + "ORDER BY a.fecha DESC, a.id DESC")
    List<AuditoriaJpaEntity> buscar(@Param("entidad") String entidad, @Param("idEntidad") Long idEntidad,
                                    Pageable pagina);
}
