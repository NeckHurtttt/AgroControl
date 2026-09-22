package com.agrocontrol;

import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.usuario.domain.Usuario;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        Rol administrador = new Rol(1L, "ADMINISTRADOR");
        Rol jefeDeCampo   = new Rol(2L, "JEFE_DE_CAMPO");
        Rol operario      = new Rol(3L, "OPERARIO");
        Rol almacenero    = new Rol(4L, "ALMACENERO");
        Rol supervisor    = new Rol(5L, "SUPERVISOR");

        administrador.agregarUsuario(new Usuario(1L, "Sergio Rioja", "sergio@agrocontrol.com", administrador.getId()));
        jefeDeCampo.agregarUsuario(new Usuario(2L, "Jefe de Campo 1", "jefe@agrocontrol.com", jefeDeCampo.getId()));
        operario.agregarUsuario(new Usuario(3L, "Operario 1", "operario1@agrocontrol.com", operario.getId()));
        operario.agregarUsuario(new Usuario(4L, "Operario 2", "operario2@agrocontrol.com", operario.getId()));
        almacenero.agregarUsuario(new Usuario(5L, "Almacenero 1", "almacen@agrocontrol.com", almacenero.getId()));
        supervisor.agregarUsuario(new Usuario(6L, "Supervisor 1", "supervisor@agrocontrol.com", supervisor.getId()));

        List<Rol> roles = List.of(administrador, jefeDeCampo, operario, almacenero, supervisor);

        for (Rol rol : roles) {
            System.out.println("Rol: " + rol.getNombre() + " (" + rol.getUsuarios().size() + " usuarios)");
            for (Usuario u : rol.getUsuarios()) {
                System.out.println("   - " + u.getNombreCompleto() + " | " + u.getEmail() + " | " + u.getEstado());
            }
        }
    }
}