package com.agrocontrol.labor.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora_campo", schema = "agrocontrol")
public class BitacoraCampo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bitacora")
    private Long id;

    @Column(name = "id_labor", nullable = false)
    private Long laborId;

    @Column(name = "id_usuario", nullable = false)
    private Long usuarioId;

    @Column(name = "observacion", nullable = false, columnDefinition = "text")
    private String observacion;

    @Column(name = "fecha", nullable = false, updatable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    protected BitacoraCampo() {
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
