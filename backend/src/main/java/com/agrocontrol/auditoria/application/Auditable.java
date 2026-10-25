package com.agrocontrol.auditoria.application;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marca un caso de uso como cambio crítico (RF-16). Si termina sin excepción, AuditoriaAspect guarda
 * quién lo hizo, sobre qué entidad y cuándo. El id auditado es el del objeto devuelto o, si el método
 * no devuelve nada (p. ej. eliminar), su primer argumento Long.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String entidad();
    String accion();
}
