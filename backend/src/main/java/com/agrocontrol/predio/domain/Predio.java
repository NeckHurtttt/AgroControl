package com.agrocontrol.predio.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "predio", schema = "agrocontrol")
public class Predio {

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

    protected Predio() {
    }

    public Predio(Long id, String nombre, String ubicacion, BigDecimal areaHa) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del predio no puede estar vacío");
        }
        if (areaHa != null && areaHa.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El área del predio debe ser mayor que cero");
        }
        this.id = id;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.areaHa = areaHa;
        this.activo = true;
    }

    public void activar() { this.activo = true; }
    public void desactivar() { this.activo = false; }

    public void actualizarUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public void actualizarArea(BigDecimal areaHa) {
        if (areaHa != null && areaHa.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El área del predio debe ser mayor que cero");
        }
        this.areaHa = areaHa;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getUbicacion() { return ubicacion; }
    public BigDecimal getAreaHa() { return areaHa; }
    public boolean isActivo() { return activo; }
}
