package com.agrocontrol.insumo.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ConsumoLabor {
    private final Long id;
    private final Long laborId;
    private final Long insumoId;
    private final BigDecimal cantidad;
    private final LocalDateTime fecha;

    public ConsumoLabor(Long id, Long laborId, Long insumoId, BigDecimal cantidad) {
        if (laborId == null) {
            throw new IllegalArgumentException("El consumo debe estar asociado a una labor");
        }
        if (insumoId == null) {
            throw new IllegalArgumentException("El consumo debe estar asociado a un insumo");
        }
        if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("La cantidad consumida debe ser mayor que cero");
        }
        this.id = id;
        this.laborId = laborId;
        this.insumoId = insumoId;
        this.cantidad = cantidad;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getLaborId() { return laborId; }
    public Long getInsumoId() { return insumoId; }
    public BigDecimal getCantidad() { return cantidad; }
    public LocalDateTime getFecha() { return fecha; }
}
