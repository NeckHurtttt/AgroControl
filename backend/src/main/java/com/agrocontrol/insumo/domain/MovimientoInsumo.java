package com.agrocontrol.insumo.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimiento_insumo", schema = "agrocontrol")
public class MovimientoInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimiento")
    private Long id;

    @Column(name = "id_insumo", nullable = false)
    private Long insumoId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false, length = 10)
    private TipoMovimiento tipo;

    @Column(name = "cantidad", nullable = false, precision = 12, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "motivo", length = 150)
    private String motivo;

    @Column(name = "id_usuario", nullable = false)
    private Long usuarioId;

    @Column(name = "fecha", nullable = false, updatable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    protected MovimientoInsumo() {
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
