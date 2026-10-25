package com.agrocontrol.bitacora.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BitacoraCampoJpaRepository extends JpaRepository<BitacoraCampoJpaEntity, Long> {

    List<BitacoraCampoJpaEntity> findByLaborIdOrderByFechaDesc(Long laborId);

    // La bitácora no guarda la parcela: se llega a ella a través de la labor
    @Query("SELECT b FROM BitacoraCampoJpaEntity b WHERE b.laborId IN "
            + "(SELECT l.id FROM LaborJpaEntity l WHERE l.parcelaId = :parcelaId) ORDER BY b.fecha DESC")
    List<BitacoraCampoJpaEntity> findDeParcela(@Param("parcelaId") Long parcelaId);
}
