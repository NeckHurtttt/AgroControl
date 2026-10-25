package com.agrocontrol.predio.domain;

import java.math.BigDecimal;

public class Predio {

    private Long id;
    private String nombre;
    private String ubicacion;
    private BigDecimal areaHa;
    private boolean activo;

    private Predio() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static Predio reconstruir(Long id, String nombre, String ubicacion, BigDecimal areaHa, boolean activo) {
        Predio p = new Predio();
        p.id = id;
        p.nombre = nombre;
        p.ubicacion = ubicacion;
        p.areaHa = areaHa;
        p.activo = activo;
        return p;
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

    public void renombrar(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del predio no puede estar vacío");
        }
        this.nombre = nombre;
    }

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
