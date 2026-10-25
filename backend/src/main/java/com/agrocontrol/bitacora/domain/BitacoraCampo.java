package com.agrocontrol.bitacora.domain;

import java.time.LocalDateTime;

// Observación que deja quien está en el campo sobre una labor: qué se hizo, cantidades, estado del cultivo.
public class BitacoraCampo {

    private Long id;
    private Long laborId;
    private Long usuarioId;
    private String observacion;
    private LocalDateTime fecha = LocalDateTime.now();

    private BitacoraCampo() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static BitacoraCampo reconstruir(Long id, Long laborId, Long usuarioId, String observacion,
                                           LocalDateTime fecha) {
        BitacoraCampo b = new BitacoraCampo();
        b.id = id;
        b.laborId = laborId;
        b.usuarioId = usuarioId;
        b.observacion = observacion;
        b.fecha = fecha;
        return b;
    }

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
    }

    public Long getId() { return id; }
    public Long getLaborId() { return laborId; }
    public Long getUsuarioId() { return usuarioId; }
    public String getObservacion() { return observacion; }
    public LocalDateTime getFecha() { return fecha; }
}
