package com.agrocontrol.auth.domain;

import com.agrocontrol.usuario.domain.Usuario;

// Puerto de salida: el dominio no sabe si el token es JWT u otra cosa.
public interface GeneradorToken {
    String generar(Usuario usuario, String rol);
}
