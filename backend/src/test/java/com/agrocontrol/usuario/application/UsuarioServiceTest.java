package com.agrocontrol.usuario.application;

import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.rol.domain.RolRepository;
import com.agrocontrol.rol.domain.exception.RolNoEncontradoException;
import com.agrocontrol.usuario.application.command.RegistrarUsuarioCommand;
import com.agrocontrol.usuario.domain.CodificadorPassword;
import com.agrocontrol.usuario.domain.Usuario;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import com.agrocontrol.usuario.domain.exception.EmailUsuarioDuplicadoException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;
    @Mock
    private RolRepository rolRepository;
    @Mock
    private CodificadorPassword codificadorPassword;

    @InjectMocks
    private UsuarioService service;

    private final RegistrarUsuarioCommand comando =
            new RegistrarUsuarioCommand(2L, "Ana Vaca", "ana@agrocontrol.com", "clave-segura");

    @Test
    void guardaLaContrasenaCodificada() {
        when(rolRepository.buscarPorId(2L)).thenReturn(Optional.of(new Rol(2L, "OPERARIO", null)));
        when(usuarioRepository.existePorEmail("ana@agrocontrol.com")).thenReturn(false);
        when(codificadorPassword.codificar("clave-segura")).thenReturn("$2a$10$hash");
        when(usuarioRepository.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        Usuario usuario = service.registrar(comando);

        assertThat(usuario.getPasswordHash()).isEqualTo("$2a$10$hash");
    }

    @Test
    void rolInexistenteLanza404() {
        when(rolRepository.buscarPorId(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.registrar(comando)).isInstanceOf(RolNoEncontradoException.class);
    }

    @Test
    void emailRepetidoLanza409() {
        when(rolRepository.buscarPorId(2L)).thenReturn(Optional.of(new Rol(2L, "OPERARIO", null)));
        when(usuarioRepository.existePorEmail("ana@agrocontrol.com")).thenReturn(true);

        assertThatThrownBy(() -> service.registrar(comando)).isInstanceOf(EmailUsuarioDuplicadoException.class);
        verify(usuarioRepository, never()).guardar(any());
    }
}
