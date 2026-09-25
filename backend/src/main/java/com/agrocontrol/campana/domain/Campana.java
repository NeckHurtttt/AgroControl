package com.agrocontrol.campana.domain;

import java.time.LocalDate;

public class Campana {
    private final Long id;
    private final Long parcelaId;
    private final Long cultivoId;
    private final LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estado;

    public Campana(Long id, Long parcelaId, Long cultivoId, LocalDate fechaInicio) {
        if (parcelaId == null) {
            throw new IllegalArgumentException("La campaña debe estar asociada a una parcela");
        }
        if (cultivoId == null) {
            throw new IllegalArgumentException("La campaña debe estar asociada a un cultivo");
        }
        if (fechaInicio == null) {
            throw new IllegalArgumentException("La fecha de inicio es obligatoria");
        }
        this.id = id;
        this.parcelaId = parcelaId;
        this.cultivoId = cultivoId;
        this.fechaInicio = fechaInicio;
        this.estado = "PLANIFICADA";
    }

    public void finalizar(LocalDate fechaFin) {
        if (fechaFin == null) {
            throw new IllegalArgumentException("La fecha de fin es obligatoria para finalizar la campaña");
        }
        if (fechaFin.isBefore(fechaInicio)) {
            throw new IllegalArgumentException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
        this.fechaFin = fechaFin;
        this.estado = "FINALIZADA";
    }

    public void cambiarEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            throw new IllegalArgumentException("El estado de la campaña no puede estar vacío");
        }
        this.estado = estado;
    }

    public Long getId() { return id; }
    public Long getParcelaId() { return parcelaId; }
    public Long getCultivoId() { return cultivoId; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public String getEstado() { return estado; }
}
