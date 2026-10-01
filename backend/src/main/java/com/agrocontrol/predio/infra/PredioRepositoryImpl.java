package com.agrocontrol.predio.infra;

import com.agrocontrol.predio.domain.Predio;
import com.agrocontrol.predio.domain.PredioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PredioRepositoryImpl implements PredioRepository {

    private final PredioJpaRepository jpaRepository;

    public PredioRepositoryImpl(PredioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Predio guardar(Predio predio) {
        return jpaRepository.save(predio);
    }

    @Override
    public Optional<Predio> buscarPorId(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Predio> listarTodos() {
        return jpaRepository.findAll(Sort.by("id"));
    }

    @Override
    public boolean existePorId(Long id) {
        return jpaRepository.existsById(id);
    }
}
