package com.agrocontrol.usuario.application;

import com.agrocontrol.rol.domain.RolRepository;
import com.agrocontrol.rol.domain.exception.RolNoEncontradoException;
import com.agrocontrol.usuario.application.command.RegistrarUsuarioCommand;
import com.agrocontrol.usuario.domain.CodificadorPassword;
import com.agrocontrol.usuario.domain.Usuario;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import com.agrocontrol.usuario.domain.exception.EmailUsuarioDuplicadoException;
import com.agrocontrol.usuario.domain.exception.UsuarioNoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final CodificadorPassword codificadorPassword;

    public UsuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository,
                          CodificadorPassword codificadorPassword) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.codificadorPassword = codificadorPassword;
    }

    @Transactional
    public Usuario registrar(RegistrarUsuarioCommand command) {
        // El padre debe existir antes de crear el hijo: se detecta aquí (404), no como error de FK (500)
        if (rolRepository.buscarPorId(command.rolId()).isEmpty()) {
            throw new RolNoEncontradoException(command.rolId());
        }
        if (usuarioRepository.existePorEmail(command.email())) {
            throw new EmailUsuarioDuplicadoException(command.email());
        }
        Usuario nuevo = new Usuario(
                null,
                command.nombreCompleto(),
                command.email(),
                codificadorPassword.codificar(command.password()),
                command.rolId()
        );
        return usuarioRepository.guardar(nuevo);
    }

    @Transactional(readOnly = true)
    public List<Usuario> listar() {
        return usuarioRepository.listarTodos();
    }

    @Transactional(readOnly = true)
    public Usuario obtener(Long id) {
        return usuarioRepository.buscarPorId(id)
                .orElseThrow(() -> new UsuarioNoEncontradoException(id));
    }
}
