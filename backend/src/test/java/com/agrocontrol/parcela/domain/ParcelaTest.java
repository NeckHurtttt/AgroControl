package com.agrocontrol.parcela.domain;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ParcelaTest {

    @Test
    void nuevaParcelaQuedaDisponible() {
        Parcela parcela = new Parcela(null, 1L, "P-01", new BigDecimal("2.50"));

        assertThat(parcela.getEstado()).isEqualTo("DISPONIBLE");
    }

    @Test
    void rechazaParcelaSinPredio() {
        assertThatThrownBy(() -> new Parcela(null, null, "P-01", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("predio");
    }

    @Test
    void rechazaCodigoVacio() {
        assertThatThrownBy(() -> new Parcela(null, 1L, "  ", null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void rechazaAreaCeroONegativa() {
        assertThatThrownBy(() -> new Parcela(null, 1L, "P-01", BigDecimal.ZERO))
                .isInstanceOf(IllegalArgumentException.class);
        Parcela parcela = new Parcela(null, 1L, "P-01", null);
        assertThatThrownBy(() -> parcela.actualizarArea(new BigDecimal("-1")))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
