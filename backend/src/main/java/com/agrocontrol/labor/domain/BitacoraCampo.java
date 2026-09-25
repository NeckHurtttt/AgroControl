package com.agrocontrol.labor.domain;

import java.time.LocalDateTime;

public class BitacoraCampo {
    private final Long id;
    private final Long laborId;
    private final Long usuarioId;
    private final String observacion;
    private final LocalDateTime fecha;

    public BitacoraCampo(Long id, Long laborId, Long usuarioId, String observacion) {
        if (laborId == null) {
            throw new IllegalArgumentException("La bitácora debe estar asociada a una labor");
        }
        if (usuarioId == null) {
            throw new IllegalArgumentException("La bitácora debe indicar un usuario");
        }
        if (observacion == null || observacion.isBlank()) {
            throw new IllegalArgumentException("La observación no puede estar vacía");
        }
        this.id = id;
        this.laborId = laborId;
        this.usuarioId = usuarioId;
        this.observacion = observacion;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getLaborId() { return laborId; }
    public Long getUsuarioId() { return usuarioId; }
    public String getObservacion() { return observacion; }
    public LocalDateTime getFecha() { return fecha; }
}
