package com.agrocontrol.incidencia.infrastructure.adapter.out.persistence;

import com.agrocontrol.incidencia.domain.Incidencia;
import com.agrocontrol.incidencia.domain.IncidenciaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class IncidenciaPersistenceAdapter implements IncidenciaRepository {

    private final IncidenciaJpaRepository jpaRepository;

    public IncidenciaPersistenceAdapter(IncidenciaJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Incidencia guardar(Incidencia incidencia) {
        return jpaRepository.save(incidencia);
    }

    @Override
    public List<Incidencia> listarTodas() {
        return jpaRepository.findAll(Sort.by(Sort.Direction.DESC, "fecha"));
    }

    @Override
    public List<Incidencia> listarPorParcela(Long parcelaId) {
        return jpaRepository.findByParcelaIdOrderByFechaDesc(parcelaId);
    }
}
