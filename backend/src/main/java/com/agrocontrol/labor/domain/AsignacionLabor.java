package com.agrocontrol.labor.domain;

import java.time.LocalDateTime;

public class AsignacionLabor {

    private Long id;
    private Long laborId;
    private Long usuarioId;
    private LocalDateTime asignadoEn = LocalDateTime.now();

    private AsignacionLabor() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static AsignacionLabor reconstruir(Long id, Long laborId, Long usuarioId, LocalDateTime asignadoEn) {
        AsignacionLabor a = new AsignacionLabor();
        a.id = id;
        a.laborId = laborId;
        a.usuarioId = usuarioId;
        a.asignadoEn = asignadoEn;
        return a;
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
