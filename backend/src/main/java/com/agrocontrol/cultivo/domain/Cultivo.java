package com.agrocontrol.cultivo.domain;

public class Cultivo {

    private Long id;
    private String nombre;
    private Integer cicloDias;

    private Cultivo() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static Cultivo reconstruir(Long id, String nombre, Integer cicloDias) {
        Cultivo c = new Cultivo();
        c.id = id;
        c.nombre = nombre;
        c.cicloDias = cicloDias;
        return c;
    }

    public Cultivo(Long id, String nombre, Integer cicloDias) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del cultivo no puede estar vacío");
        }
        if (cicloDias != null && cicloDias <= 0) {
            throw new IllegalArgumentException("El ciclo del cultivo debe ser mayor que cero");
        }
        this.id = id;
        this.nombre = nombre;
        this.cicloDias = cicloDias;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public Integer getCicloDias() { return cicloDias; }
}
