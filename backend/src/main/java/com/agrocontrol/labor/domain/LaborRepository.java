package com.agrocontrol.labor.domain;

import java.util.List;
import java.util.Optional;

public interface LaborRepository {
    Labor guardar(Labor labor);
    Optional<Labor> buscarPorId(Long id);
    List<Labor> listarTodas();
    List<Labor> listarPorCampana(Long campanaId);
}
