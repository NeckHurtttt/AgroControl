package com.agrocontrol.cosecha.infrastructure.adapter.out.persistence;

import com.agrocontrol.cosecha.domain.Cosecha;
import com.agrocontrol.cosecha.domain.CosechaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CosechaPersistenceAdapter implements CosechaRepository {

    private final CosechaJpaRepository jpaRepository;

    public CosechaPersistenceAdapter(CosechaJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Cosecha guardar(Cosecha cosecha) {
        return jpaRepository.save(cosecha);
    }

    @Override
    public List<Cosecha> listarTodas() {
        return jpaRepository.findAll(Sort.by(Sort.Direction.DESC, "fecha"));
    }

    @Override
    public List<Cosecha> listarPorCampana(Long campanaId) {
        return jpaRepository.findByCampanaIdOrderByFechaDesc(campanaId);
    }
}
