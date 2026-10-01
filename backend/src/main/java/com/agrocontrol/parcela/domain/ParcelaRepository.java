package com.agrocontrol.parcela.domain;

import java.util.List;
import java.util.Optional;

public interface ParcelaRepository {
    Parcela guardar(Parcela parcela);
    Optional<Parcela> buscarPorId(Long id);
    List<Parcela> listarTodas();
    List<Parcela> listarPorPredio(Long predioId);
    boolean existeCodigoEnPredio(Long predioId, String codigo);
}
