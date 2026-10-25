package com.agrocontrol.labor.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Labor {

    private Long id;
    private Long campanaId;
    private Long parcelaId;
    private String tipo;
    private LocalDate fechaPlan;
    private LocalDate fechaEjecucion;
    private EstadoLabor estado;
    private LocalDateTime creadoEn = LocalDateTime.now();

    private Labor() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static Labor reconstruir(Long id, Long campanaId, Long parcelaId, String tipo, LocalDate fechaPlan,
                                    LocalDate fechaEjecucion, EstadoLabor estado, LocalDateTime creadoEn) {
        Labor l = new Labor();
        l.id = id;
        l.campanaId = campanaId;
        l.parcelaId = parcelaId;
        l.tipo = tipo;
        l.fechaPlan = fechaPlan;
        l.fechaEjecucion = fechaEjecucion;
        l.estado = estado;
        l.creadoEn = creadoEn;
        return l;
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
        this.estado = EstadoLabor.PLANIFICADA;
    }

    public void ejecutar(LocalDate fechaEjecucion) {
        if (estado == EstadoLabor.EJECUTADA) {
            throw new IllegalStateException("La labor ya fue ejecutada");
        }
        if (fechaEjecucion == null) {
            throw new IllegalArgumentException("La fecha de ejecución es obligatoria");
        }
        this.fechaEjecucion = fechaEjecucion;
        this.estado = EstadoLabor.EJECUTADA;
    }

    public Long getId() { return id; }
    public Long getCampanaId() { return campanaId; }
    public Long getParcelaId() { return parcelaId; }
    public String getTipo() { return tipo; }
    public LocalDate getFechaPlan() { return fechaPlan; }
    public LocalDate getFechaEjecucion() { return fechaEjecucion; }
    public EstadoLabor getEstado() { return estado; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
}
