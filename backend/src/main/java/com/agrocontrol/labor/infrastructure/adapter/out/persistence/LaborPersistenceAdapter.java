package com.agrocontrol.labor.infrastructure.adapter.out.persistence;

import com.agrocontrol.labor.domain.Labor;
import com.agrocontrol.labor.domain.LaborRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class LaborPersistenceAdapter implements LaborRepository {

    private final LaborJpaRepository jpaRepository;

    public LaborPersistenceAdapter(LaborJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
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
}
