package com.agrocontrol.auditoria.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria", schema = "agrocontrol")
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Long id;

    @Column(name = "id_usuario")
    private Long usuarioId;

    @Column(name = "entidad", nullable = false, length = 60)
    private String entidad;

    @Column(name = "id_entidad", nullable = false)
    private Long idEntidad;

    @Column(name = "accion", nullable = false, length = 30)
    private String accion;

    @Column(name = "detalle", columnDefinition = "text")
    private String detalle;

    @Column(name = "fecha", nullable = false, updatable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    protected Auditoria() {
    }

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
    }

    public Long getId() { return id; }
    public Long getUsuarioId() { return usuarioId; }
    public String getEntidad() { return entidad; }
    public Long getIdEntidad() { return idEntidad; }
    public String getAccion() { return accion; }
    public String getDetalle() { return detalle; }
    public LocalDateTime getFecha() { return fecha; }
}
