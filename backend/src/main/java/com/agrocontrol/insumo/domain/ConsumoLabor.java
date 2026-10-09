package com.agrocontrol.insumo.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "consumo_labor", schema = "agrocontrol")
public class ConsumoLabor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consumo")
    private Long id;

    @Column(name = "id_labor", nullable = false)
    private Long laborId;

    @Column(name = "id_insumo", nullable = false)
    private Long insumoId;

    @Column(name = "cantidad", nullable = false, precision = 12, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "fecha", nullable = false, updatable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    protected ConsumoLabor() {
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
