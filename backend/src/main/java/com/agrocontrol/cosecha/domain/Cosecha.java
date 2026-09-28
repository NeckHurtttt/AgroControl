package com.agrocontrol.cosecha.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cosecha", schema = "agrocontrol")
public class Cosecha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cosecha")
    private Long id;

    @Column(name = "id_campana", nullable = false)
    private Long campanaId;

    @Column(name = "cantidad", nullable = false, precision = 12, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "unidad_medida", nullable = false, length = 20)
    private String unidadMedida;

    @Column(name = "fecha", nullable = false, updatable = false)
    private LocalDate fecha = LocalDate.now();

    @Column(name = "id_usuario", nullable = false)
    private Long usuarioId;

    protected Cosecha() {
    }

    public Cosecha(Long id, Long campanaId, BigDecimal cantidad, String unidadMedida, Long usuarioId) {
        if (campanaId == null) {
            throw new IllegalArgumentException("La cosecha debe estar asociada a una campaña");
        }
        if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("La cantidad cosechada debe ser mayor que cero");
        }
        if (unidadMedida == null || unidadMedida.isBlank()) {
            throw new IllegalArgumentException("La unidad de medida no puede estar vacía");
        }
        if (usuarioId == null) {
            throw new IllegalArgumentException("La cosecha debe registrarse con un usuario");
        }
        this.id = id;
        this.campanaId = campanaId;
        this.cantidad = cantidad;
        this.unidadMedida = unidadMedida;
        this.usuarioId = usuarioId;
    }

    public Long getId() { return id; }
    public Long getCampanaId() { return campanaId; }
    public BigDecimal getCantidad() { return cantidad; }
    public String getUnidadMedida() { return unidadMedida; }
    public LocalDate getFecha() { return fecha; }
    public Long getUsuarioId() { return usuarioId; }
}
