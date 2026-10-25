package com.agrocontrol.insumo.application;

import com.agrocontrol.insumo.domain.CategoriaInsumo;

import java.math.BigDecimal;

// Cuánto salió del almacén de un insumo en un período (consumos en labores y salidas manuales).
public record SalidaDeAlmacen(
        Long insumoId,
        String nombre,
        CategoriaInsumo categoria,
        String unidadMedida,
        BigDecimal cantidad,
        int movimientos
) {
}
