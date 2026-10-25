package com.agrocontrol.auditoria.infrastructure.adapter.in.web.dto;

import com.agrocontrol.auditoria.domain.Auditoria;

import java.time.LocalDateTime;

public record AuditoriaResponse(
        Long id,
        Long usuarioId,
        String entidad,
        Long idEntidad,
        String accion,
        String detalle,
        LocalDateTime fecha
) {
    public static AuditoriaResponse desde(Auditoria auditoria) {
        return new AuditoriaResponse(
                auditoria.getId(),
                auditoria.getUsuarioId(),
                auditoria.getEntidad(),
                auditoria.getIdEntidad(),
                auditoria.getAccion(),
                auditoria.getDetalle(),
                auditoria.getFecha()
        );
    }
}
