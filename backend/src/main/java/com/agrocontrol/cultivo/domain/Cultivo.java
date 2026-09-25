package com.agrocontrol.cultivo.domain;

public class Cultivo {
    private final Long id;
    private final String nombre;
    private final Integer cicloDias;

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
