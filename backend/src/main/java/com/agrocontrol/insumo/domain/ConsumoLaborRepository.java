package com.agrocontrol.insumo.domain;

import java.util.List;

public interface ConsumoLaborRepository {
    ConsumoLabor guardar(ConsumoLabor consumo);
    List<ConsumoLabor> listarPorLabor(Long laborId);
}
