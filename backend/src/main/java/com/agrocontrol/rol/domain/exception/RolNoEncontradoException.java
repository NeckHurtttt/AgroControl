package com.agrocontrol.rol.domain.exception;

public class RolNoEncontradoException extends RuntimeException {
    public RolNoEncontradoException(Long id) {
        super("No existe el rol con id: " + id);
    }
}
