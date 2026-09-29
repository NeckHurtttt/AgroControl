package com.agrocontrol.rol.domain;

import java.util.List;
import java.util.Optional;

public interface RolRepository {
    Rol guardar(Rol rol);
    Optional<Rol> buscarPorId(Long id);
    List<Rol> listarTodos();
    boolean existePorNombre(String nombre);
    boolean existePorNombreEnOtroRol(String nombre, Long idExcluido);
    boolean tieneUsuariosAsignados(Long id);
    void eliminar(Long id);
}
