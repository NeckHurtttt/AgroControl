package com.agrocontrol.cultivo.infrastructure.adapter.in.web.dto;

import com.agrocontrol.cultivo.domain.Cultivo;

public record CultivoResponse(Long id, String nombre, Integer cicloDias) {
    public static CultivoResponse desde(Cultivo cultivo) {
        return new CultivoResponse(cultivo.getId(), cultivo.getNombre(), cultivo.getCicloDias());
    }
}
