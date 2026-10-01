package com.agrocontrol.rol.domain.exception;

public class RolConUsuariosException extends RuntimeException {
    public RolConUsuariosException(Long id) {
        super("No se puede eliminar el rol " + id + " porque tiene usuarios asignados");
    }
}
