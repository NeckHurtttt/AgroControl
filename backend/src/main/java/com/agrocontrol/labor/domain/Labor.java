package com.agrocontrol.labor.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Labor {
    private final Long id;
    private final Long campanaId;
    private final Long parcelaId;
    private final String tipo;
    private final LocalDate fechaPlan;
    private LocalDate fechaEjecucion;
    private String estado;
    private final LocalDateTime creadoEn;

    public Labor(Long id, Long campanaId, Long parcelaId, String tipo, LocalDate fechaPlan) {
        if (campanaId == null) {
            throw new IllegalArgumentException("La labor debe estar asociada a una campaña");
        }
        if (parcelaId == null) {
            throw new IllegalArgumentException("La labor debe estar asociada a una parcela");
        }
        if (tipo == null || tipo.isBlank()) {
            throw new IllegalArgumentException("El tipo de labor no puede estar vacío");
        }
        if (fechaPlan == null) {
            throw new IllegalArgumentException("La fecha planificada es obligatoria");
        }
        this.id = id;
        this.campanaId = campanaId;
        this.parcelaId = parcelaId;
        this.tipo = tipo;
        this.fechaPlan = fechaPlan;
        this.estado = "PLANIFICADA";
        this.creadoEn = LocalDateTime.now();
    }

    public void ejecutar(LocalDate fechaEjecucion) {
        if (fechaEjecucion == null) {
            throw new IllegalArgumentException("La fecha de ejecución es obligatoria");
        }
        this.fechaEjecucion = fechaEjecucion;
        this.estado = "EJECUTADA";
    }

    public void cambiarEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            throw new IllegalArgumentException("El estado de la labor no puede estar vacío");
        }
        this.estado = estado;
    }

    public Long getId() { return id; }
    public Long getCampanaId() { return campanaId; }
    public Long getParcelaId() { return parcelaId; }
    public String getTipo() { return tipo; }
    public LocalDate getFechaPlan() { return fechaPlan; }
    public LocalDate getFechaEjecucion() { return fechaEjecucion; }
    public String getEstado() { return estado; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
}
