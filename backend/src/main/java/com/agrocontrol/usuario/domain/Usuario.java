package com.agrocontrol.usuario.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuario", schema = "agrocontrol")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombreCompleto;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "id_rol", nullable = false)
    private Long rolId;

    @Column(name = "activo", nullable = false)
    private boolean activo;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();

    protected Usuario() {
    }

    public Usuario(Long id, String nombreCompleto, String email, String passwordHash, Long rolId) {
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
        this.activo = true;
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
