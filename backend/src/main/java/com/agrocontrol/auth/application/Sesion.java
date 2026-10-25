package com.agrocontrol.auth.application;

import com.agrocontrol.usuario.domain.Usuario;

public record Sesion(String token, Usuario usuario, String rol) {
}
