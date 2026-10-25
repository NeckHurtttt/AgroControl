package com.agrocontrol.insumo.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MovimientoInsumo {

    private Long id;
    private Long insumoId;
    private TipoMovimiento tipo;
    private BigDecimal cantidad;
    private String motivo;
    private Long usuarioId;
    private LocalDateTime fecha = LocalDateTime.now();

    private MovimientoInsumo() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static MovimientoInsumo reconstruir(Long id, Long insumoId, TipoMovimiento tipo, BigDecimal cantidad,
                                               String motivo, Long usuarioId, LocalDateTime fecha) {
        MovimientoInsumo m = new MovimientoInsumo();
        m.id = id;
        m.insumoId = insumoId;
        m.tipo = tipo;
        m.cantidad = cantidad;
        m.motivo = motivo;
        m.usuarioId = usuarioId;
        m.fecha = fecha;
        return m;
    }

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
    }

    public Long getId() { return id; }
    public Long getInsumoId() { return insumoId; }
    public TipoMovimiento getTipo() { return tipo; }
    public BigDecimal getCantidad() { return cantidad; }
    public String getMotivo() { return motivo; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getFecha() { return fecha; }
}
