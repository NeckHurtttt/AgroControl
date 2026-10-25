package com.agrocontrol.auth.infrastructure.config;

import com.agrocontrol.auth.application.AuthService;
import com.agrocontrol.auth.domain.GeneradorToken;
import com.agrocontrol.rol.domain.RolRepository;
import com.agrocontrol.usuario.domain.CodificadorPassword;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthConfig {

    @Bean
    public AuthService authService(UsuarioRepository usuarioRepository, RolRepository rolRepository,
                                   CodificadorPassword codificadorPassword, GeneradorToken generadorToken) {
        return new AuthService(usuarioRepository, rolRepository, codificadorPassword, generadorToken);
    }
}
