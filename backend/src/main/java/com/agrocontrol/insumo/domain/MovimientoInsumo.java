package com.agrocontrol.insumo.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovimientoInsumo {
    private final Long id;
    private final Long insumoId;
    private final TipoMovimiento tipo;
    private final BigDecimal cantidad;
    private final String motivo;
    private final Long usuarioId;
    private final LocalDateTime fecha;

    public MovimientoInsumo(Long id, Long insumoId, TipoMovimiento tipo, BigDecimal cantidad, String motivo, Long usuarioId) {
        if (insumoId == null) {
            throw new IllegalArgumentException("El movimiento debe estar asociado a un insumo");
        }
        if (tipo == null) {
            throw new IllegalArgumentException("El tipo de movimiento es obligatorio");
        }
        if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor que cero");
        }
        if (usuarioId == null) {
            throw new IllegalArgumentException("El movimiento debe indicar un usuario");
        }
        this.id = id;
        this.insumoId = insumoId;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.motivo = motivo;
        this.usuarioId = usuarioId;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getInsumoId() { return insumoId; }
    public TipoMovimiento getTipo() { return tipo; }
    public BigDecimal getCantidad() { return cantidad; }
    public String getMotivo() { return motivo; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getFecha() { return fecha; }
}
