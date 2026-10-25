package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import com.agrocontrol.insumo.domain.TipoMovimiento;

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
public class MovimientoInsumoJpaEntity {

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
    private LocalDateTime fecha;

    protected MovimientoInsumoJpaEntity() {
    }

    public MovimientoInsumoJpaEntity(Long id, Long insumoId, TipoMovimiento tipo, BigDecimal cantidad, String motivo,
                                     Long usuarioId, LocalDateTime fecha) {
        this.id = id;
        this.insumoId = insumoId;
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.motivo = motivo;
        this.usuarioId = usuarioId;
        this.fecha = fecha;
    }

    public Long getId() { return id; }
    public Long getInsumoId() { return insumoId; }
    public TipoMovimiento getTipo() { return tipo; }
    public BigDecimal getCantidad() { return cantidad; }
    public String getMotivo() { return motivo; }
    public Long getUsuarioId() { return usuarioId; }
    public LocalDateTime getFecha() { return fecha; }
}
