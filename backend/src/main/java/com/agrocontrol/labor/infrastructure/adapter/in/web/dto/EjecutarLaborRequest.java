package com.agrocontrol.labor.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record EjecutarLaborRequest(
        @NotNull(message = "La fecha de ejecución es obligatoria.")
        LocalDate fechaEjecucion
) {
}
