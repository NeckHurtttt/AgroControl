package com.agrocontrol.cosecha.infrastructure.config;

import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.cosecha.application.CosechaService;
import com.agrocontrol.cosecha.domain.CosechaRepository;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CosechaConfig {

    @Bean
    public CosechaService cosechaService(CosechaRepository cosechaRepository, CampanaRepository campanaRepository,
                                         UsuarioRepository usuarioRepository) {
        return new CosechaService(cosechaRepository, campanaRepository, usuarioRepository);
    }
}
