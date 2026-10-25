package com.agrocontrol.bitacora.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistrarObservacionRequest(
        @NotBlank(message = "La observación es obligatoria.")
        @Size(max = 2000, message = "La observación admite como máximo 2000 caracteres.")
        String observacion
) {
}
