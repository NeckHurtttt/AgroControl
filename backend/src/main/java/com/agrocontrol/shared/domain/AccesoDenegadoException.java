package com.agrocontrol.shared.domain;

// El usuario está autenticado pero la regla de negocio no le permite la operación (403).
public class AccesoDenegadoException extends RuntimeException {
    public AccesoDenegadoException(String mensaje) {
        super(mensaje);
    }
}
