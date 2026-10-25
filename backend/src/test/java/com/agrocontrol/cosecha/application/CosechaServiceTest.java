package com.agrocontrol.cosecha.application;

import com.agrocontrol.campana.domain.Campana;
import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.cosecha.domain.Cosecha;
import com.agrocontrol.cosecha.domain.CosechaRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import com.agrocontrol.usuario.domain.Usuario;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CosechaServiceTest {

    @Mock
    private CosechaRepository cosechaRepository;
    @Mock
    private CampanaRepository campanaRepository;
    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private CosechaService service;

    @Test
    void noSeCosechaUnaCampanaSinIniciar() {
        when(campanaRepository.buscarPorId(5L)).thenReturn(Optional.of(new Campana(5L, 3L, 1L, LocalDate.now())));

        assertThatThrownBy(() -> service.registrar(5L, BigDecimal.TEN, "t", 7L)).isInstanceOf(ConflictoException.class);
    }

    @Test
    void registraEnCampanaEnCurso() {
        Campana campana = new Campana(5L, 3L, 1L, LocalDate.now());
        campana.iniciar();
        when(campanaRepository.buscarPorId(5L)).thenReturn(Optional.of(campana));
        when(usuarioRepository.buscarPorId(7L)).thenReturn(Optional.of(mock(Usuario.class)));
        when(cosechaRepository.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        Cosecha cosecha = service.registrar(5L, new BigDecimal("2.5"), " t ", 7L);

        assertThat(cosecha.getUnidadMedida()).isEqualTo("t");
        assertThat(cosecha.getUsuarioId()).isEqualTo(7L);
    }
}
