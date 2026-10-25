package com.agrocontrol.predio.infrastructure.adapter.out.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "predio", schema = "agrocontrol")
public class PredioJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_predio")
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "ubicacion", length = 200)
    private String ubicacion;

    @Column(name = "area_ha", precision = 10, scale = 2)
    private BigDecimal areaHa;

    @Column(name = "activo", nullable = false)
    private boolean activo;

    protected PredioJpaEntity() {
    }

    public PredioJpaEntity(Long id, String nombre, String ubicacion, BigDecimal areaHa, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.areaHa = areaHa;
        this.activo = activo;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getUbicacion() { return ubicacion; }
    public BigDecimal getAreaHa() { return areaHa; }
    public boolean isActivo() { return activo; }
}
