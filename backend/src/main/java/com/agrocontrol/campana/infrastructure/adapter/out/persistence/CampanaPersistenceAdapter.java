package com.agrocontrol.campana.infrastructure.adapter.out.persistence;

import com.agrocontrol.campana.domain.Campana;
import com.agrocontrol.campana.domain.CampanaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CampanaPersistenceAdapter implements CampanaRepository {

    private final CampanaJpaRepository jpaRepository;

    public CampanaPersistenceAdapter(CampanaJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Campana guardar(Campana campana) {
        return jpaRepository.save(campana);
    }

    @Override
    public Optional<Campana> buscarPorId(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Campana> listarTodas() {
        return jpaRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaInicio"));
    }

    @Override
    public List<Campana> listarPorParcela(Long parcelaId) {
        return jpaRepository.findByParcelaIdOrderByFechaInicioDesc(parcelaId);
    }

    @Override
    public boolean existePorParcela(Long parcelaId) {
        return jpaRepository.existsByParcelaId(parcelaId);
    }

    @Override
    public boolean existeAbiertaEnParcela(Long parcelaId) {
        return jpaRepository.existsByParcelaIdAndEstadoNot(parcelaId, "FINALIZADA");
    }
}
