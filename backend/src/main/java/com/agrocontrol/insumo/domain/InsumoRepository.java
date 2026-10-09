package com.agrocontrol.insumo.domain;

import java.util.List;
import java.util.Optional;

public interface InsumoRepository {
    Insumo guardar(Insumo insumo);
    Optional<Insumo> buscarPorId(Long id);
    List<Insumo> listarTodos();
}
