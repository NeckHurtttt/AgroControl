package com.agrocontrol.incidencia.domain;

import java.util.List;

public interface IncidenciaRepository {
    Incidencia guardar(Incidencia incidencia);
    List<Incidencia> listarTodas();
    List<Incidencia> listarPorParcela(Long parcelaId);
}
