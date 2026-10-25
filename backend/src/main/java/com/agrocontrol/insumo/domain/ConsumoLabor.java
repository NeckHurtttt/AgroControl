package com.agrocontrol.insumo.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ConsumoLabor {

    private Long id;
    private Long laborId;
    private Long insumoId;
    private BigDecimal cantidad;
    private LocalDateTime fecha = LocalDateTime.now();

    private ConsumoLabor() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static ConsumoLabor reconstruir(Long id, Long laborId, Long insumoId, BigDecimal cantidad,
                                           LocalDateTime fecha) {
        ConsumoLabor c = new ConsumoLabor();
        c.id = id;
        c.laborId = laborId;
        c.insumoId = insumoId;
        c.cantidad = cantidad;
        c.fecha = fecha;
        return c;
    }

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
    }

    public Long getId() { return id; }
    public Long getLaborId() { return laborId; }
    public Long getInsumoId() { return insumoId; }
    public BigDecimal getCantidad() { return cantidad; }
    public LocalDateTime getFecha() { return fecha; }
}
