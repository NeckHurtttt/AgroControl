package com.agrocontrol.auditoria.domain;

import java.time.LocalDateTime;

// Rastro de un cambio crítico: quién (usuarioId), sobre qué (entidad + idEntidad), qué hizo y cuándo.
public class Auditoria {

    private Long id;
    private Long usuarioId;
    private String entidad;
    private Long idEntidad;
    private String accion;
    private String detalle;
    private LocalDateTime fecha = LocalDateTime.now();

    private Auditoria() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static Auditoria reconstruir(Long id, Long usuarioId, String entidad, Long idEntidad, String accion,
                                        String detalle, LocalDateTime fecha) {
        Auditoria a = new Auditoria();
        a.id = id;
        a.usuarioId = usuarioId;
        a.entidad = entidad;
        a.idEntidad = idEntidad;
        a.accion = accion;
        a.detalle = detalle;
        a.fecha = fecha;
        return a;
    }

    // usuarioId puede ser null: cambios hechos sin sesión (p. ej. tareas internas al arrancar)
    public Auditoria(Long usuarioId, String entidad, Long idEntidad, String accion, String detalle) {
        if (entidad == null || entidad.isBlank()) {
            throw new IllegalArgumentException("La entidad auditada es obligatoria");
        }
        if (idEntidad == null) {
            throw new IllegalArgumentException("El identificador de la entidad auditada es obligatorio");
        }
        if (accion == null || accion.isBlank()) {
            throw new IllegalArgumentException("La acción auditada es obligatoria");
        }
        this.usuarioId = usuarioId;
        this.entidad = entidad;
        this.idEntidad = idEntidad;
        this.accion = accion;
        this.detalle = detalle;
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public String getEntidad() { return entidad; }
    public Long getIdEntidad() { return idEntidad; }
    public String getAccion() { return accion; }
    public String getDetalle() { return detalle; }
    public LocalDateTime getFecha() { return fecha; }
}
