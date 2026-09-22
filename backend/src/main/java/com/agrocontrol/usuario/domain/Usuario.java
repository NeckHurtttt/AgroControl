package com.agrocontrol.usuario.domain;

public class Usuario {
    private final Long id;
    private final String nombreCompleto;
    private final String email;
    private final Long rolId;
    private EstadoUsuario estado;

    public Usuario(Long id, String nombreCompleto, String email, Long rolId) {
        if (nombreCompleto == null || nombreCompleto.isBlank()) {
            throw new IllegalArgumentException("El nombre completo es obligatorio");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("El email no es válido");
        }
        if (rolId == null) {
            throw new IllegalArgumentException("El usuario debe tener un rol asignado");
        }
        this.id = id;
        this.nombreCompleto = nombreCompleto;
        this.email = email;
        this.rolId = rolId;
        this.estado = EstadoUsuario.ACTIVO;
    }

    public void desactivar() { this.estado = EstadoUsuario.INACTIVO; }
    public void activar() { this.estado = EstadoUsuario.ACTIVO; }

    public Long getId() { return id; }
    public String getNombreCompleto() { return nombreCompleto; }
    public String getEmail() { return email; }
    public Long getRolId() { return rolId; }
    public EstadoUsuario getEstado() { return estado; }
}
