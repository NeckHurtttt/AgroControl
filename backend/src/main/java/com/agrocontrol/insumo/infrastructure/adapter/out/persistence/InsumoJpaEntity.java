package com.agrocontrol.insumo.infrastructure.adapter.out.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "insumo", schema = "agrocontrol")
public class InsumoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo")
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "unidad_medida", nullable = false, length = 20)
    private String unidadMedida;

    @Column(name = "stock_actual", nullable = false, precision = 12, scale = 2)
    private BigDecimal stockActual;

    protected InsumoJpaEntity() {
    }

    public InsumoJpaEntity(Long id, String nombre, String unidadMedida, BigDecimal stockActual) {
        this.id = id;
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.stockActual = stockActual;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getUnidadMedida() { return unidadMedida; }
    public BigDecimal getStockActual() { return stockActual; }
}
