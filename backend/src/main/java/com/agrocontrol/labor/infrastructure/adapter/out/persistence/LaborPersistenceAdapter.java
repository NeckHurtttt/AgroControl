package com.agrocontrol.labor.infrastructure.adapter.out.persistence;

import com.agrocontrol.labor.domain.AsignacionLabor;
import com.agrocontrol.labor.domain.Labor;
import com.agrocontrol.labor.domain.LaborRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class LaborPersistenceAdapter implements LaborRepository {

    private final LaborJpaRepository jpaRepository;
    private final AsignacionLaborJpaRepository asignacionJpaRepository;

    public LaborPersistenceAdapter(LaborJpaRepository jpaRepository,
                                   AsignacionLaborJpaRepository asignacionJpaRepository) {
        this.jpaRepository = jpaRepository;
        this.asignacionJpaRepository = asignacionJpaRepository;
    }

    @Override
    public Labor guardar(Labor labor) {
        return jpaRepository.save(labor);
    }

    @Override
    public Optional<Labor> buscarPorId(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Labor> listarTodas() {
        return jpaRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaPlan"));
    }

    @Override
    public List<Labor> listarPorCampana(Long campanaId) {
        return jpaRepository.findByCampanaIdOrderByFechaPlanAsc(campanaId);
    }

    @Override
    public List<Labor> listarAsignadasA(Long usuarioId) {
        return jpaRepository.findAsignadasA(usuarioId);
    }

    @Override
    public boolean estaAsignada(Long laborId, Long usuarioId) {
        return asignacionJpaRepository.existsByLaborIdAndUsuarioId(laborId, usuarioId);
    }

    @Override
    public AsignacionLabor asignar(AsignacionLabor asignacion) {
        return asignacionJpaRepository.save(asignacion);
    }

    @Override
    public List<AsignacionLabor> listarAsignaciones() {
        return asignacionJpaRepository.findAll();
    }
}
