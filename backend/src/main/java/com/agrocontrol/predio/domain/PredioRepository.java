package com.agrocontrol.predio.domain;

import java.util.List;
import java.util.Optional;

public interface PredioRepository {
    Predio guardar(Predio predio);
    Optional<Predio> buscarPorId(Long id);
    List<Predio> listarTodos();
    boolean existePorId(Long id);
}
