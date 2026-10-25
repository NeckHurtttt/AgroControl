package com.agrocontrol.insumo.domain;

import java.math.BigDecimal;

public class Insumo {

    private Long id;
    private String nombre;
    private String unidadMedida;
    private BigDecimal stockActual = BigDecimal.ZERO;
    private CategoriaInsumo categoria = CategoriaInsumo.OTRO;
    // Por debajo de esto el almacenero tiene que reponer (0 = sin aviso)
    private BigDecimal stockMinimo = BigDecimal.ZERO;

    private Insumo() {
    }

    // Rehidrata un registro ya guardado (lo usa el mapper de persistencia): no repite las validaciones de alta.
    public static Insumo reconstruir(Long id, String nombre, String unidadMedida, BigDecimal stockActual,
                                     CategoriaInsumo categoria, BigDecimal stockMinimo) {
        Insumo i = new Insumo();
        i.id = id;
        i.nombre = nombre;
        i.unidadMedida = unidadMedida;
        i.stockActual = stockActual;
        i.categoria = categoria;
        i.stockMinimo = stockMinimo;
        return i;
    }

    public Insumo(Long id, String nombre, String unidadMedida, CategoriaInsumo categoria, BigDecimal stockMinimo) {
        this(id, nombre, unidadMedida);
        clasificar(categoria, stockMinimo);
    }

    public Insumo(Long id, String nombre, String unidadMedida) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del insumo no puede estar vacío");
        }
        if (unidadMedida == null || unidadMedida.isBlank()) {
            throw new IllegalArgumentException("La unidad de medida no puede estar vacía");
        }
        this.id = id;
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.stockActual = BigDecimal.ZERO;
    }

    public void actualizar(String nombre, String unidadMedida, CategoriaInsumo categoria, BigDecimal stockMinimo) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del insumo no puede estar vacío");
        }
        if (unidadMedida == null || unidadMedida.isBlank()) {
            throw new IllegalArgumentException("La unidad de medida no puede estar vacía");
        }
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        clasificar(categoria, stockMinimo);
    }

    private void clasificar(CategoriaInsumo categoria, BigDecimal stockMinimo) {
        if (stockMinimo != null && stockMinimo.signum() < 0) {
            throw new IllegalArgumentException("El stock mínimo no puede ser negativo");
        }
        this.categoria = categoria == null ? CategoriaInsumo.OTRO : categoria;
        this.stockMinimo = stockMinimo == null ? BigDecimal.ZERO : stockMinimo;
    }

    // Hay que reponer: el stock llegó al mínimo (si se definió uno)
    public boolean porAgotarse() {
        return stockMinimo.signum() > 0 && stockActual.compareTo(stockMinimo) <= 0;
    }

    public void registrarEntrada(BigDecimal cantidad) {
        if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("La cantidad a ingresar debe ser mayor que cero");
        }
        this.stockActual = this.stockActual.add(cantidad);
    }

    public void registrarSalida(BigDecimal cantidad) {
        if (cantidad == null || cantidad.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("La cantidad a retirar debe ser mayor que cero");
        }
        if (this.stockActual.compareTo(cantidad) < 0) {
            throw new IllegalStateException("No hay suficiente stock disponible (stock actual: " + stockActual + " " + unidadMedida + ")");
        }
        this.stockActual = this.stockActual.subtract(cantidad);
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getUnidadMedida() { return unidadMedida; }
    public BigDecimal getStockActual() { return stockActual; }
    public CategoriaInsumo getCategoria() { return categoria; }
    public BigDecimal getStockMinimo() { return stockMinimo; }
}
