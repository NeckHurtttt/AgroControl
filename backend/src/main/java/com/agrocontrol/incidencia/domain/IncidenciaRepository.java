package com.agrocontrol.incidencia.domain;

import java.util.List;
import java.util.Optional;

public interface IncidenciaRepository {
    Incidencia guardar(Incidencia incidencia);
    Optional<Incidencia> buscarPorId(Long id);
    List<Incidencia> listarTodas();
    List<Incidencia> listarPorParcela(Long parcelaId);
}
