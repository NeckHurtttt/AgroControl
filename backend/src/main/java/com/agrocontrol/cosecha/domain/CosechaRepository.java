package com.agrocontrol.cosecha.domain;

import java.util.List;

public interface CosechaRepository {
    Cosecha guardar(Cosecha cosecha);
    List<Cosecha> listarTodas();
    List<Cosecha> listarPorCampana(Long campanaId);
}
