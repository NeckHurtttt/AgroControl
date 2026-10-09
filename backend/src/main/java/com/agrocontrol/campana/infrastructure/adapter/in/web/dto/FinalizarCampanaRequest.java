package com.agrocontrol.campana.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record FinalizarCampanaRequest(
        @NotNull(message = "La fecha de fin es obligatoria.")
        LocalDate fechaFin
) {
}
