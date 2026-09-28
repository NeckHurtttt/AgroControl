package com.agrocontrol.incidencia.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidencia", schema = "agrocontrol")
public class Incidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_incidencia")
    private Long id;

    @Column(name = "id_parcela")
    private Long parcelaId;

    @Column(name = "id_campana")
    private Long campanaId;

    @Column(name = "id_labor")
    private Long laborId;

    @Column(name = "descripcion", nullable = false, columnDefinition = "text")
    private String descripcion;

    @Column(name = "id_usuario", nullable = false)
    private Long usuarioId;

    @Column(name = "fecha", nullable = false, updatable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    protected Incidencia() {
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
