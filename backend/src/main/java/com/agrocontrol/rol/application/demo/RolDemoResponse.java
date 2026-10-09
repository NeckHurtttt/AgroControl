package com.agrocontrol.rol.application.demo;

public record RolDemoResponse(
        Long id,
        String nombre,
        String descripcion,
        int cantidadUsuarios
) {}
