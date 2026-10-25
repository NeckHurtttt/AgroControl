package com.agrocontrol.insumo.domain;

import java.util.List;
import java.util.Optional;

public interface InsumoRepository {
    Insumo guardar(Insumo insumo);
    Optional<Insumo> buscarPorId(Long id);

    // Para cambiar el stock: bloquea la fila hasta el fin de la transacción, así dos movimientos
    // simultáneos del mismo insumo se aplican uno detrás del otro y ninguno pisa al otro.
    Optional<Insumo> buscarPorIdParaActualizar(Long id);
    List<Insumo> listarTodos();
}
