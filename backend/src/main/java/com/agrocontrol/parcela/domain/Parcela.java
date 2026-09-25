package com.agrocontrol.parcela.domain;

import java.math.BigDecimal;

public class Parcela {
    private final Long id;
    private final Long predioId;
    private final String codigo;
    private BigDecimal areaHa;
    private String estado;

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
        this.estado = "DISPONIBLE";
    }

    public void cambiarEstado(String estado) {
        if (estado == null || estado.isBlank()) {
            throw new IllegalArgumentException("El estado de la parcela no puede estar vacío");
        }
        this.estado = estado;
    }

    public Long getId() { return id; }
    public Long getPredioId() { return predioId; }
    public String getCodigo() { return codigo; }
    public BigDecimal getAreaHa() { return areaHa; }
    public String getEstado() { return estado; }
}
