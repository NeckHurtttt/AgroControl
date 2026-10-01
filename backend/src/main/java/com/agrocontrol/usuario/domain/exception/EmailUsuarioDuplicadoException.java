package com.agrocontrol.usuario.domain.exception;

public class EmailUsuarioDuplicadoException extends RuntimeException {
    public EmailUsuarioDuplicadoException(String email) {
        super("Ya existe un usuario con el email: " + email);
    }
}
