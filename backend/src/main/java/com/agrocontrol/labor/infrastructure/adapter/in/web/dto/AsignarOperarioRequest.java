package com.agrocontrol.labor.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotNull;

public record AsignarOperarioRequest(
        @NotNull(message = "Debe indicar el operario.")
        Long usuarioId
) {
}
