package com.agrocontrol.incidencia.domain;

import java.time.LocalDateTime;

public class Incidencia {
    private final Long id;
    private final Long parcelaId;
    private final Long campanaId;
    private final Long laborId;
    private final String descripcion;
    private final Long usuarioId;
    private final LocalDateTime fecha;

    public Incidencia(Long id, Long parcelaId, Long campanaId, Long laborId, String descripcion, Long usuarioId) {
        if (descripcion == null || descripcion.isBlank()) {
            throw new IllegalArgumentException("La descripción de la incidencia no puede estar vacía");
        }
        if (usuarioId == null) {
            throw new IllegalArgumentException("La incidencia debe registrarse con un usuario");
        }
        this.id = id;
        this.parcelaId = parcelaId;
        this.campanaId = campanaId;
        this.laborId = laborId;
        this.descripcion = descripcion;
        this.usuarioId = usuarioId;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getParcelaId() { return parcelaId; }
    public Long getCampanaId() { return campanaId; }
    public Long getLaborId() { return laborId; }
    public String getDescripcion() { return descripcion; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getFecha() { return fecha; }
}
