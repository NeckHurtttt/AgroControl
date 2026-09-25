package com.agrocontrol.labor.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "asignacion_labor",
        schema = "agrocontrol",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id_labor", "id_usuario"})
)
public class AsignacionLabor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asignacion")
    private Long id;

    @Column(name = "id_labor", nullable = false)
    private Long laborId;

    @Column(name = "id_usuario", nullable = false)
    private Long usuarioId;

    @Column(name = "asignado_en", nullable = false, updatable = false)
    private LocalDateTime asignadoEn = LocalDateTime.now();

    protected AsignacionLabor() {
    }

    public AsignacionLabor(Long id, Long laborId, Long usuarioId) {
        if (laborId == null) {
            throw new IllegalArgumentException("La asignación debe indicar una labor");
        }
        if (usuarioId == null) {
            throw new IllegalArgumentException("La asignación debe indicar un usuario");
        }
        this.id = id;
        this.laborId = laborId;
        this.usuarioId = usuarioId;
    }

    public Long getId() { return id; }
    public Long getLaborId() { return laborId; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getAsignadoEn() { return asignadoEn; }
}
