package com.agrocontrol.rol.application;

import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.rol.domain.RolRepository;
import com.agrocontrol.rol.domain.exception.NombreRolDuplicadoException;
import com.agrocontrol.rol.domain.exception.RolConUsuariosException;
import com.agrocontrol.rol.domain.exception.RolNoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public class RolService {

    private final RolRepository repository;

    public RolService(RolRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Rol registrar(Rol rol) {
        if (repository.existePorNombre(rol.getNombre())) {
            throw new NombreRolDuplicadoException(rol.getNombre());
        }
        return repository.guardar(rol);
    }

    @Transactional(readOnly = true)
    public Rol obtener(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new RolNoEncontradoException(id));
    }

    @Transactional(readOnly = true)
    public List<Rol> listar() {
        return repository.listarTodos();
    }

    @Transactional
    public Rol actualizar(Long id, String nombre, String descripcion) {
        obtener(id);
        if (repository.existePorNombreEnOtroRol(nombre, id)) {
            throw new NombreRolDuplicadoException(nombre);
        }
        return repository.guardar(new Rol(id, nombre, descripcion));
    }

    @Transactional
    public void eliminar(Long id) {
        obtener(id);
        if (repository.tieneUsuariosAsignados(id)) {
            throw new RolConUsuariosException(id);
        }
        repository.eliminar(id);
    }
}
