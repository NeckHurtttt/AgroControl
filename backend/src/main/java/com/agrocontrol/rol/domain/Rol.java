package com.agrocontrol.rol.domain;

import com.agrocontrol.usuario.domain.Usuario;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Rol {
    private final Long id;
    private final String nombre;
    private final List<Usuario> usuarios = new ArrayList<>();

    public Rol(Long id, String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del rol no puede estar vacío");
        }
        this.id = id;
        this.nombre = nombre;
    }

    public void agregarUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("El usuario no puede ser nulo");
        }
        usuarios.add(usuario);
    }

    public List<Usuario> getUsuarios() {
        return Collections.unmodifiableList(usuarios);
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
}
