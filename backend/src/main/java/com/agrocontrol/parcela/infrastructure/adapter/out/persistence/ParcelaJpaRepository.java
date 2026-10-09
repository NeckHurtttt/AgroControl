package com.agrocontrol.parcela.infrastructure.adapter.out.persistence;

import com.agrocontrol.parcela.domain.Parcela;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParcelaJpaRepository extends JpaRepository<Parcela, Long> {
    List<Parcela> findByPredioIdOrderByIdAsc(Long predioId);
    boolean existsByPredioId(Long predioId);
    boolean existsByPredioIdAndCodigoIgnoreCase(Long predioId, String codigo);
    boolean existsByPredioIdAndCodigoIgnoreCaseAndIdNot(Long predioId, String codigo, Long id);
}
