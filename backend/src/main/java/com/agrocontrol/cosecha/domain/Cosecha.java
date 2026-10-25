package com.agrocontrol.cosecha.domain;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Cosecha {

    private Long id;
    private Long campanaId;
    private BigDecimal cantidad;
    private String unidadMedida;
    private LocalDate fecha = LocalDate.now();
    private Long usuarioId;

    private Cosecha() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static Cosecha reconstruir(Long id, Long campanaId, BigDecimal cantidad, String unidadMedida,
                                      LocalDate fecha, Long usuarioId) {
        Cosecha c = new Cosecha();
        c.id = id;
        c.campanaId = campanaId;
        c.cantidad = cantidad;
        c.unidadMedida = unidadMedida;
        c.fecha = fecha;
        c.usuarioId = usuarioId;
        return c;
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
