package com.agrocontrol.auditoria.domain;

import java.time.LocalDateTime;

public class Auditoria {
    private final Long id;
    private final Long usuarioId;
    private final String entidad;
    private final Long idEntidad;
    private final String accion;
    private final String detalle;
    private final LocalDateTime fecha;

    public Auditoria(Long id, Long usuarioId, String entidad, Long idEntidad, String accion, String detalle) {
        if (entidad == null || entidad.isBlank()) {
            throw new IllegalArgumentException("La entidad auditada es obligatoria");
        }
        if (idEntidad == null) {
            throw new IllegalArgumentException("El identificador de la entidad auditada es obligatorio");
        }
        if (accion == null || accion.isBlank()) {
            throw new IllegalArgumentException("La acción auditada es obligatoria");
        }
        this.id = id;
        this.usuarioId = usuarioId;
        this.entidad = entidad;
        this.idEntidad = idEntidad;
        this.accion = accion;
        this.detalle = detalle;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public String getEntidad() { return entidad; }
    public Long getIdEntidad() { return idEntidad; }
    public String getAccion() { return accion; }
    public String getDetalle() { return detalle; }
    public LocalDateTime getFecha() { return fecha; }
}
