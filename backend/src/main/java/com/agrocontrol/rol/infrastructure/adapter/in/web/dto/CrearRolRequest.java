package com.agrocontrol.rol.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CrearRolRequest(
        @NotBlank(message = "El nombre del rol es obligatorio")
        @Size(max = 50, message = "El nombre del rol no puede superar 50 caracteres")
        @Pattern(regexp = "^[A-Z_]+$", message = "El nombre del rol debe estar en MAYÚSCULAS y usar _ como separador (ej. JEFE_DE_CAMPO)")
        String nombre,

        @Size(max = 200, message = "La descripción no puede superar 200 caracteres")
        String descripcion
) {}
