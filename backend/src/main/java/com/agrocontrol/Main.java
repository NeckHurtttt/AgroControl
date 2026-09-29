package com.agrocontrol;

import com.agrocontrol.rol.application.RolService;
import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.rol.domain.RolRepository;
import com.agrocontrol.rol.domain.exception.NombreRolDuplicadoException;
import com.agrocontrol.rol.domain.exception.RolNoEncontradoException;
import com.agrocontrol.rol.infrastructure.memory.RolRepositoryEnMemoria;
import com.agrocontrol.usuario.application.command.RegistrarUsuarioCommand;
import com.agrocontrol.usuario.domain.Usuario;

import java.util.List;

public class Main {
    public static void main(String[] args) {
        RolRepository repository = new RolRepositoryEnMemoria();
        RolService service = new RolService(repository);

        // Camino positivo: registrar los 5 roles reales de AgroControl
        Rol administrador = service.registrar(new Rol(null, "ADMINISTRADOR", "Gestiona usuarios y configuración"));
        Rol jefeDeCampo   = service.registrar(new Rol(null, "JEFE_DE_CAMPO", "Planifica campañas y labores"));
        Rol operario      = service.registrar(new Rol(null, "OPERARIO", "Ejecuta labores en parcela"));
        Rol almacenero    = service.registrar(new Rol(null, "ALMACENERO", "Controla el stock de insumos"));
        Rol supervisor    = service.registrar(new Rol(null, "SUPERVISOR", "Revisa bitácora e incidencias"));

        // El record lleva solo los datos que necesita la operación "registrar usuario"
        List<RegistrarUsuarioCommand> comandos = List.of(
                new RegistrarUsuarioCommand(administrador.getId(), "Sergio Rioja", "sergio@agrocontrol.com", "hash-demo-001"),
                new RegistrarUsuarioCommand(jefeDeCampo.getId(), "Jefe de Campo 1", "jefe@agrocontrol.com", "hash-demo-002"),
                new RegistrarUsuarioCommand(operario.getId(), "Operario 1", "operario1@agrocontrol.com", "hash-demo-003"),
                new RegistrarUsuarioCommand(operario.getId(), "Operario 2", "operario2@agrocontrol.com", "hash-demo-004"),
                new RegistrarUsuarioCommand(almacenero.getId(), "Almacenero 1", "almacen@agrocontrol.com", "hash-demo-005"),
                new RegistrarUsuarioCommand(supervisor.getId(), "Supervisor 1", "supervisor@agrocontrol.com", "hash-demo-006")
        );
        for (RegistrarUsuarioCommand cmd : comandos) {
            Rol rol = service.obtener(cmd.rolId());
            rol.agregarUsuario(new Usuario(null, cmd.nombreCompleto(), cmd.email(), cmd.passwordHash(), cmd.rolId()));
        }

        System.out.println("Roles registrados: " + service.listar().size());
        for (Rol rol : service.listar()) {
            System.out.println("Rol " + rol.getId() + ": " + rol.getNombre() + " (" + rol.getUsuarios().size() + " usuarios)");
            for (Usuario u : rol.getUsuarios()) {
                System.out.println("   - " + u.getNombreCompleto() + " | " + u.getEmail() + " | " + u.getEstado());
            }
        }
        System.out.println("obtener(" + operario.getId() + ") -> " + service.obtener(operario.getId()).getNombre());

        // Caminos negativos: cada uno dispara una excepción propia del dominio
        try {
            service.obtener(999L);
        } catch (RolNoEncontradoException ex) {
            System.out.println("ERROR CONTROLADO: " + ex.getMessage());
        }

        try {
            service.registrar(new Rol(null, "operario"));
        } catch (NombreRolDuplicadoException ex) {
            System.out.println("ERROR CONTROLADO: " + ex.getMessage());
        }
    }
}
