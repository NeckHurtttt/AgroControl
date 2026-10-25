package com.agrocontrol.parcela.domain;

import java.math.BigDecimal;

public class Parcela {

    private Long id;
    private Long predioId;
    private String codigo;
    private BigDecimal areaHa;
    private EstadoParcela estado;

    private Parcela() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static Parcela reconstruir(Long id, Long predioId, String codigo, BigDecimal areaHa, EstadoParcela estado) {
        Parcela p = new Parcela();
        p.id = id;
        p.predioId = predioId;
        p.codigo = codigo;
        p.areaHa = areaHa;
        p.estado = estado;
        return p;
    }

    public Parcela(Long id, Long predioId, String codigo, BigDecimal areaHa) {
        if (predioId == null) {
            throw new IllegalArgumentException("La parcela debe pertenecer a un predio");
        }
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("El código de la parcela no puede estar vacío");
        }
        if (areaHa != null && areaHa.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El área de la parcela debe ser mayor que cero");
        }
        this.id = id;
        this.predioId = predioId;
        this.codigo = codigo;
        this.areaHa = areaHa;
        this.estado = EstadoParcela.DISPONIBLE;
    }

    public void cambiarCodigo(String codigo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("El código de la parcela no puede estar vacío");
        }
        this.codigo = codigo;
    }

    public void moverAPredio(Long predioId) {
        if (predioId == null) {
            throw new IllegalArgumentException("La parcela debe pertenecer a un predio");
        }
        this.predioId = predioId;
    }

    public void actualizarArea(BigDecimal areaHa) {
        if (areaHa != null && areaHa.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El área de la parcela debe ser mayor que cero");
        }
        this.areaHa = areaHa;
    }

    public void cambiarEstado(EstadoParcela estado) {
        if (estado == null) {
            throw new IllegalArgumentException("El estado de la parcela es obligatorio");
        }
        this.estado = estado;
    }

    public Long getId() { return id; }
    public Long getPredioId() { return predioId; }
    public String getCodigo() { return codigo; }
    public BigDecimal getAreaHa() { return areaHa; }
    public EstadoParcela getEstado() { return estado; }
}
