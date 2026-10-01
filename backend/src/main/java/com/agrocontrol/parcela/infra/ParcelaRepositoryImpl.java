package com.agrocontrol.parcela.infra;

import com.agrocontrol.parcela.domain.Parcela;
import com.agrocontrol.parcela.domain.ParcelaRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ParcelaRepositoryImpl implements ParcelaRepository {

    private final ParcelaJpaRepository jpaRepository;

    public ParcelaRepositoryImpl(ParcelaJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Parcela guardar(Parcela parcela) {
        return jpaRepository.save(parcela);
    }

    @Override
    public Optional<Parcela> buscarPorId(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Parcela> listarTodas() {
        return jpaRepository.findAll(Sort.by("id"));
    }

    @Override
    public List<Parcela> listarPorPredio(Long predioId) {
        return jpaRepository.findByPredioIdOrderByIdAsc(predioId);
    }

    @Override
    public boolean existeCodigoEnPredio(Long predioId, String codigo) {
        return jpaRepository.existsByPredioIdAndCodigoIgnoreCase(predioId, codigo);
    }
}
