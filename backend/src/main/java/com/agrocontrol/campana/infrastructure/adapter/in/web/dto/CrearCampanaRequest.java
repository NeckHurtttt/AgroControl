package com.agrocontrol.campana.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CrearCampanaRequest(
        @NotNull(message = "Debe indicar la parcela.")
        Long parcelaId,

        @NotNull(message = "Debe indicar el cultivo.")
        Long cultivoId,

        @NotNull(message = "La fecha de inicio es obligatoria.")
        LocalDate fechaInicio
) {
}
