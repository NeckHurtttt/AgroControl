package com.agrocontrol.usuario.domain;

import java.time.LocalDateTime;

public class Usuario {

    private final Long id;
    private final String nombreCompleto;
    private final String email;
    private final String passwordHash;
    private final Long rolId;
    private boolean activo;
    private final LocalDateTime creadoEn;

    public Usuario(Long id, String nombreCompleto, String email, String passwordHash, Long rolId) {
        this(id, nombreCompleto, email, passwordHash, rolId, true, LocalDateTime.now());
    }

    public Usuario(Long id, String nombreCompleto, String email, String passwordHash, Long rolId,
                   boolean activo, LocalDateTime creadoEn) {
        if (nombreCompleto == null || nombreCompleto.isBlank()) {
            throw new IllegalArgumentException("El nombre completo es obligatorio");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("El email no es válido");
        }
        if (passwordHash == null || passwordHash.isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        if (rolId == null) {
            throw new IllegalArgumentException("El usuario debe tener un rol asignado");
        }
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.passwordHash = passwordHash;
        this.rolId = rolId;
        this.activo = activo;
        this.creadoEn = creadoEn;
    }

    public void desactivar() { this.activo = false; }
    public void activar() { this.activo = true; }

    public Long getId() { return id; }
    public String getNombreCompleto() { return nombreCompleto; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public Long getRolId() { return rolId; }
    public boolean isActivo() { return activo; }
    public EstadoUsuario getEstado() { return activo ? EstadoUsuario.ACTIVO : EstadoUsuario.INACTIVO; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
}
