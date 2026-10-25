package com.agrocontrol.parcela.infrastructure.adapter.out.persistence;

import com.agrocontrol.parcela.domain.EstadoParcela;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class ParcelaJpaEntity {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoParcela estado;

    protected ParcelaJpaEntity() {
    }

    public ParcelaJpaEntity(Long id, Long predioId, String codigo, BigDecimal areaHa, EstadoParcela estado) {
        this.id = id;
        this.predioId = predioId;
        this.codigo = codigo;
        this.areaHa = areaHa;
        this.estado = estado;
    }

    public Long getId() { return id; }
    public Long getPredioId() { return predioId; }
    public String getCodigo() { return codigo; }
    public BigDecimal getAreaHa() { return areaHa; }
    public EstadoParcela getEstado() { return estado; }
}
