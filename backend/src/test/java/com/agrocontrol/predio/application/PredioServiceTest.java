package com.agrocontrol.predio.application;

import com.agrocontrol.parcela.domain.ParcelaRepository;
import com.agrocontrol.predio.domain.Predio;
import com.agrocontrol.predio.domain.PredioRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PredioServiceTest {

    @Mock
    private PredioRepository predioRepository;

    @Mock
    private ParcelaRepository parcelaRepository;

    @InjectMocks
    private PredioService service;

    @Test
    void crearRecortaElNombreYRespetaActivo() {
        when(predioRepository.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        Predio creado = service.crear("  La Esperanza  ", "Warnes", new BigDecimal("10"), false);

        assertThat(creado.getNombre()).isEqualTo("La Esperanza");
        assertThat(creado.isActivo()).isFalse();
    }

    @Test
    void obtenerInexistenteLanza404() {
        when(predioRepository.buscarPorId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.obtener(99L)).isInstanceOf(RecursoNoEncontradoException.class);
    }

    @Test
    void noEliminaPredioConParcelas() {
        when(predioRepository.buscarPorId(1L)).thenReturn(Optional.of(new Predio(1L, "A", null, null)));
        when(parcelaRepository.existePorPredio(1L)).thenReturn(true);

        assertThatThrownBy(() -> service.eliminar(1L)).isInstanceOf(ConflictoException.class);
        verify(predioRepository, never()).eliminar(any());
    }

    @Test
    void eliminaPredioSinParcelas() {
        when(predioRepository.buscarPorId(1L)).thenReturn(Optional.of(new Predio(1L, "A", null, null)));
        when(parcelaRepository.existePorPredio(1L)).thenReturn(false);

        service.eliminar(1L);

        verify(predioRepository).eliminar(1L);
    }
}
