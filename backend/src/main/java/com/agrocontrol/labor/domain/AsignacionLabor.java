package com.agrocontrol.labor.domain;

import java.time.LocalDateTime;

public class AsignacionLabor {
    private final Long id;
    private final Long laborId;
    private final Long usuarioId;
    private final LocalDateTime asignadoEn;

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
        this.asignadoEn = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getLaborId() { return laborId; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getAsignadoEn() { return asignadoEn; }
}
