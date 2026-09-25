package com.agrocontrol.labor.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "labor", schema = "agrocontrol")
public class Labor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_labor")
    private Long id;

    @Column(name = "id_campana", nullable = false)
    private Long campanaId;

    @Column(name = "id_parcela", nullable = false)
    private Long parcelaId;

    @Column(name = "tipo", nullable = false, length = 60)
    private String tipo;

    @Column(name = "fecha_plan", nullable = false)
    private LocalDate fechaPlan;

    @Column(name = "fecha_ejecucion")
    private LocalDate fechaEjecucion;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();

    protected Labor() {
    }

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
