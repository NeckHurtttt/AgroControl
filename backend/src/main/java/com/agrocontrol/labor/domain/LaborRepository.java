package com.agrocontrol.labor.domain;

import java.util.List;
import java.util.Optional;

public interface LaborRepository {
    Labor guardar(Labor labor);
    Optional<Labor> buscarPorId(Long id);
    List<Labor> listarTodas();
    List<Labor> listarPorCampana(Long campanaId);
    List<Labor> listarAsignadasA(Long usuarioId);
    boolean estaAsignada(Long laborId, Long usuarioId);
    AsignacionLabor asignar(AsignacionLabor asignacion);
    List<AsignacionLabor> listarAsignaciones();
}
