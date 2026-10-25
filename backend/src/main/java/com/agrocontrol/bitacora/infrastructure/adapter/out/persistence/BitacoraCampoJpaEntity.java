package com.agrocontrol.bitacora.infrastructure.adapter.out.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora_campo", schema = "agrocontrol")
public class BitacoraCampoJpaEntity {

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
    private LocalDateTime fecha;

    protected BitacoraCampoJpaEntity() {
    }

    public BitacoraCampoJpaEntity(Long id, Long laborId, Long usuarioId, String observacion, LocalDateTime fecha) {
        this.id = id;
        this.laborId = laborId;
        this.usuarioId = usuarioId;
        this.observacion = observacion;
        this.fecha = fecha;
    }

    public Long getId() { return id; }
    public Long getLaborId() { return laborId; }
    public Long getUsuarioId() { return usuarioId; }
    public String getObservacion() { return observacion; }
    public LocalDateTime getFecha() { return fecha; }
}
