package com.agrocontrol.rol.infrastructure.adapter.in.web.dto;

import com.agrocontrol.rol.domain.Rol;

public record RolResponse(
        Long id,
        String nombre,
        String descripcion
) {
    public static RolResponse desde(Rol rol) {
        return new RolResponse(rol.getId(), rol.getNombre(), rol.getDescripcion());
    }
}
