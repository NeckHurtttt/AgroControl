package com.agrocontrol.parcela.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;

@Entity
@Table(
        name = "parcela",
        schema = "agrocontrol",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id_predio", "codigo"})
)
public class Parcela {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_parcela")
    private Long id;

    @Column(name = "id_predio", nullable = false)
    private Long predioId;

    @Column(name = "codigo", nullable = false, length = 30)
    private String codigo;

    @Column(name = "area_ha", precision = 10, scale = 2)
    private BigDecimal areaHa;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    protected Parcela() {
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
