package com.agrocontrol.bitacora.infrastructure.adapter.in.web.dto;

import com.agrocontrol.bitacora.domain.BitacoraCampo;

import java.time.LocalDateTime;

public record BitacoraResponse(
        Long id,
        Long laborId,
        Long usuarioId,
        String observacion,
        LocalDateTime fecha
) {
    public static BitacoraResponse desde(BitacoraCampo entrada) {
        return new BitacoraResponse(
                entrada.getId(),
                entrada.getLaborId(),
                entrada.getUsuarioId(),
                entrada.getObservacion(),
                entrada.getFecha()
        );
    }
}
