package com.agrocontrol.insumo.domain;

import java.util.List;

public interface MovimientoInsumoRepository {
    MovimientoInsumo guardar(MovimientoInsumo movimiento);
    List<MovimientoInsumo> listarPorInsumo(Long insumoId);
}
