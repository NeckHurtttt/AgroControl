package com.agrocontrol.rol.application;

import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.rol.domain.RolRepository;
import com.agrocontrol.rol.domain.exception.NombreRolDuplicadoException;
import com.agrocontrol.rol.domain.exception.RolNoEncontradoException;

import java.util.List;

public class RolService {

    private final RolRepository repository;

    public RolService(RolRepository repository) {
        this.repository = repository;
    }

    public Rol registrar(Rol rol) {
        if (repository.existePorNombre(rol.getNombre())) {
            throw new NombreRolDuplicadoException(rol.getNombre());
        }
        return repository.guardar(rol);
    }

    public Rol obtener(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new RolNoEncontradoException(id));
    }

    public List<Rol> listar() {
        return repository.listarTodos();
    }
}
