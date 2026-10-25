package com.agrocontrol.incidencia.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResolverIncidenciaRequest(
        @NotBlank(message = "Indique cómo se resolvió la incidencia.")
        @Size(max = 1000, message = "La resolución admite como máximo 1000 caracteres.")
        String resolucion
) {
}
