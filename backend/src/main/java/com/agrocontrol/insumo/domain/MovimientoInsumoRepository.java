package com.agrocontrol.insumo.domain;

import java.time.LocalDateTime;
import java.util.List;

public interface MovimientoInsumoRepository {
    MovimientoInsumo guardar(MovimientoInsumo movimiento);
    List<MovimientoInsumo> listarPorInsumo(Long insumoId);
    // Todo lo que salió del almacén en el período [desde, hasta)
    List<MovimientoInsumo> listarSalidasEntre(LocalDateTime desde, LocalDateTime hasta);
}
