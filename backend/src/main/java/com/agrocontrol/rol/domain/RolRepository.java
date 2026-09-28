package com.agrocontrol.rol.domain;

import java.util.List;
import java.util.Optional;

public interface RolRepository {
    Rol guardar(Rol rol);
    Optional<Rol> buscarPorId(Long id);
    List<Rol> listarTodos();
}
