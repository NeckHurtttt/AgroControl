package com.agrocontrol.incidencia.domain;

import java.time.LocalDateTime;

public class Incidencia {

    private Long id;
    private Long parcelaId;
    private Long campanaId;
    private Long laborId;
    private String descripcion;
    private Long usuarioId;
    private LocalDateTime fecha = LocalDateTime.now();

    private Incidencia() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static Incidencia reconstruir(Long id, Long parcelaId, Long campanaId, Long laborId, String descripcion,
                                         Long usuarioId, LocalDateTime fecha) {
        Incidencia i = new Incidencia();
        i.id = id;
        i.parcelaId = parcelaId;
        i.campanaId = campanaId;
        i.laborId = laborId;
        i.descripcion = descripcion;
        i.usuarioId = usuarioId;
        i.fecha = fecha;
        return i;
    }

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
    }

    public Long getId() { return id; }
    public Long getParcelaId() { return parcelaId; }
    public Long getCampanaId() { return campanaId; }
    public Long getLaborId() { return laborId; }
    public String getDescripcion() { return descripcion; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getFecha() { return fecha; }
}
