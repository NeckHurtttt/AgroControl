package com.agrocontrol.usuario.application.command;

public record RegistrarUsuarioCommand(
        Long rolId,
        String nombreCompleto,
        String email,
        String password
) {}
