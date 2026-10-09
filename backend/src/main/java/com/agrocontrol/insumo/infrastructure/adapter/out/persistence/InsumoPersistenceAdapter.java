package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import com.agrocontrol.insumo.domain.ConsumoLabor;
import com.agrocontrol.insumo.domain.ConsumoLaborRepository;
import com.agrocontrol.insumo.domain.Insumo;
import com.agrocontrol.insumo.domain.InsumoRepository;
import com.agrocontrol.insumo.domain.MovimientoInsumo;
import com.agrocontrol.insumo.domain.MovimientoInsumoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

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
        return insumoJpaRepository.save(insumo);
    }

    @Override
    public Optional<Insumo> buscarPorId(Long id) {
        return insumoJpaRepository.findById(id);
    }

    @Override
    public List<Insumo> listarTodos() {
        return insumoJpaRepository.findAll(Sort.by("nombre"));
    }

    @Override
    public MovimientoInsumo guardar(MovimientoInsumo movimiento) {
        return movimientoJpaRepository.save(movimiento);
    }

    @Override
    public List<MovimientoInsumo> listarPorInsumo(Long insumoId) {
        return movimientoJpaRepository.findByInsumoIdOrderByFechaDesc(insumoId);
    }

    @Override
    public ConsumoLabor guardar(ConsumoLabor consumo) {
        return consumoJpaRepository.save(consumo);
    }

    @Override
    public List<ConsumoLabor> listarPorLabor(Long laborId) {
        return consumoJpaRepository.findByLaborIdOrderByFechaAsc(laborId);
    }
}
