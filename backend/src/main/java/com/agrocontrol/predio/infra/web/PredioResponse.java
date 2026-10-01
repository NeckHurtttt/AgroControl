package com.agrocontrol.predio.infra.web;

import com.agrocontrol.predio.domain.Predio;

import java.math.BigDecimal;

public record PredioResponse(
        Long id,
        String nombre,
        String ubicacion,
        BigDecimal areaHa,
        boolean activo
) {
    public static PredioResponse desde(Predio predio) {
        return new PredioResponse(
                predio.getId(),
                predio.getNombre(),
                predio.getUbicacion(),
                predio.getAreaHa(),
                predio.isActivo()
        );
    }
}
