package com.agrocontrol.cultivo.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cultivo", schema = "agrocontrol")
public class Cultivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cultivo")
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true, length = 80)
    private String nombre;

    @Column(name = "ciclo_dias")
    private Integer cicloDias;

    protected Cultivo() {
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
