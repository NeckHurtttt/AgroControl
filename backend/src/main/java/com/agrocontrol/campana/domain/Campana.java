package com.agrocontrol.campana.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "campana", schema = "agrocontrol")
public class Campana {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_campana")
    private Long id;

    @Column(name = "id_parcela", nullable = false)
    private Long parcelaId;

    @Column(name = "id_cultivo", nullable = false)
    private Long cultivoId;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    protected Campana() {
    }

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
