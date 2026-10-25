package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import com.agrocontrol.insumo.domain.ConsumoLabor;
import com.agrocontrol.insumo.domain.ConsumoLaborRepository;
import com.agrocontrol.insumo.domain.Insumo;
import com.agrocontrol.insumo.domain.InsumoRepository;
import com.agrocontrol.insumo.domain.MovimientoInsumo;
import com.agrocontrol.insumo.domain.MovimientoInsumoRepository;
import com.agrocontrol.insumo.domain.TipoMovimiento;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// Un solo adaptador implementa los tres puertos del módulo de inventario.
@Repository
public class InsumoPersistenceAdapter implements InsumoRepository, MovimientoInsumoRepository, ConsumoLaborRepository {

    private final InsumoJpaRepository insumoJpaRepository;
    private final MovimientoInsumoJpaRepository movimientoJpaRepository;
    private final ConsumoLaborJpaRepository consumoJpaRepository;

    public InsumoPersistenceAdapter(InsumoJpaRepository insumoJpaRepository,
                                    MovimientoInsumoJpaRepository movimientoJpaRepository,
                                    ConsumoLaborJpaRepository consumoJpaRepository) {
        this.insumoJpaRepository = insumoJpaRepository;
        this.movimientoJpaRepository = movimientoJpaRepository;
        this.consumoJpaRepository = consumoJpaRepository;
    }

    @Override
    public Insumo guardar(Insumo insumo) {
        return InsumoPersistenceMapper.toDomain(insumoJpaRepository.save(InsumoPersistenceMapper.toEntity(insumo)));
    }

    @Override
    public Optional<Insumo> buscarPorId(Long id) {
        return insumoJpaRepository.findById(id).map(InsumoPersistenceMapper::toDomain);
    }

    @Override
    public Optional<Insumo> buscarPorIdParaActualizar(Long id) {
        return insumoJpaRepository.findByIdParaActualizar(id).map(InsumoPersistenceMapper::toDomain);
    }

    @Override
    public List<Insumo> listarTodos() {
        return insumoJpaRepository.findAll(Sort.by("nombre")).stream().map(InsumoPersistenceMapper::toDomain).toList();
    }

    @Override
    public MovimientoInsumo guardar(MovimientoInsumo movimiento) {
        return MovimientoInsumoPersistenceMapper.toDomain(
                       movimientoJpaRepository.save(MovimientoInsumoPersistenceMapper.toEntity(movimiento)));
    }

    @Override
    public List<MovimientoInsumo> listarPorInsumo(Long insumoId) {
        return movimientoJpaRepository.findByInsumoIdOrderByFechaDesc(insumoId)
                .stream().map(MovimientoInsumoPersistenceMapper::toDomain).toList();
    }

    @Override
    public List<MovimientoInsumo> listarSalidasEntre(LocalDateTime desde, LocalDateTime hasta) {
        return movimientoJpaRepository.findByTipoAndFechaGreaterThanEqualAndFechaLessThan(TipoMovimiento.SALIDA, desde, hasta)
                .stream().map(MovimientoInsumoPersistenceMapper::toDomain).toList();
    }

    @Override
    public ConsumoLabor guardar(ConsumoLabor consumo) {
        return ConsumoLaborPersistenceMapper.toDomain(
                       consumoJpaRepository.save(ConsumoLaborPersistenceMapper.toEntity(consumo)));
    }

    @Override
    public List<ConsumoLabor> listarPorLabor(Long laborId) {
        return consumoJpaRepository.findByLaborIdOrderByFechaAsc(laborId)
                .stream().map(ConsumoLaborPersistenceMapper::toDomain).toList();
    }
}
