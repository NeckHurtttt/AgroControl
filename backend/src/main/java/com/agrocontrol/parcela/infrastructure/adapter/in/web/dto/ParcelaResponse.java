package com.agrocontrol.parcela.infrastructure.adapter.in.web.dto;

import com.agrocontrol.parcela.domain.Parcela;

import java.math.BigDecimal;

public record ParcelaResponse(
        Long id,
        Long predioId,
        String codigo,
        BigDecimal areaHa,
        String estado
) {
    public static ParcelaResponse desde(Parcela parcela) {
        return new ParcelaResponse(
                parcela.getId(),
                parcela.getPredioId(),
                parcela.getCodigo(),
                parcela.getAreaHa(),
                parcela.getEstado()
        );
    }
}
