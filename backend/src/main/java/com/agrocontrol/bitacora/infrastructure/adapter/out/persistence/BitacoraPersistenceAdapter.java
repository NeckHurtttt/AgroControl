package com.agrocontrol.bitacora.infrastructure.adapter.out.persistence;

import com.agrocontrol.bitacora.domain.BitacoraCampo;
import com.agrocontrol.bitacora.domain.BitacoraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BitacoraPersistenceAdapter implements BitacoraRepository {

    private final BitacoraCampoJpaRepository jpaRepository;

    public BitacoraPersistenceAdapter(BitacoraCampoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public BitacoraCampo guardar(BitacoraCampo entrada) {
        return BitacoraCampoPersistenceMapper.toDomain(
                jpaRepository.save(BitacoraCampoPersistenceMapper.toEntity(entrada)));
    }

    @Override
    public List<BitacoraCampo> listarPorLabor(Long laborId) {
        return jpaRepository.findByLaborIdOrderByFechaDesc(laborId)
                .stream().map(BitacoraCampoPersistenceMapper::toDomain).toList();
    }

    @Override
    public List<BitacoraCampo> listarPorParcela(Long parcelaId) {
        return jpaRepository.findDeParcela(parcelaId)
                .stream().map(BitacoraCampoPersistenceMapper::toDomain).toList();
    }
}
