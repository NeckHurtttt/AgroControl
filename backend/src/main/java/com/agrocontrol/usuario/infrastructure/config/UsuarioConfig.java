package com.agrocontrol.usuario.infrastructure.config;

import com.agrocontrol.rol.domain.RolRepository;
import com.agrocontrol.usuario.application.UsuarioService;
import com.agrocontrol.usuario.domain.CodificadorPassword;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UsuarioConfig {

    @Bean
    public UsuarioService usuarioService(UsuarioRepository usuarioRepository, RolRepository rolRepository,
                                         CodificadorPassword codificadorPassword) {
        return new UsuarioService(usuarioRepository, rolRepository, codificadorPassword);
    }
}
