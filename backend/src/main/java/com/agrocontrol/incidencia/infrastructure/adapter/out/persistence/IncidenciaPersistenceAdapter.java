package com.agrocontrol.incidencia.infrastructure.adapter.out.persistence;

import com.agrocontrol.incidencia.domain.Incidencia;
import com.agrocontrol.incidencia.domain.IncidenciaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class IncidenciaPersistenceAdapter implements IncidenciaRepository {

    private final IncidenciaJpaRepository jpaRepository;

    public IncidenciaPersistenceAdapter(IncidenciaJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Incidencia guardar(Incidencia incidencia) {
        return IncidenciaPersistenceMapper.toDomain(
                       jpaRepository.save(IncidenciaPersistenceMapper.toEntity(incidencia)));
    }

    @Override
    public Optional<Incidencia> buscarPorId(Long id) {
        return jpaRepository.findById(id).map(IncidenciaPersistenceMapper::toDomain);
    }

    @Override
    public List<Incidencia> listarTodas() {
        return jpaRepository.findAll(Sort.by(Sort.Direction.DESC, "fecha"))
                .stream().map(IncidenciaPersistenceMapper::toDomain).toList();
    }

    @Override
    public List<Incidencia> listarPorParcela(Long parcelaId) {
        return jpaRepository.findByParcelaIdOrderByFechaDesc(parcelaId)
                .stream().map(IncidenciaPersistenceMapper::toDomain).toList();
    }
}
