package com.agrocontrol.rol.infrastructure.config;

import com.agrocontrol.rol.application.RolService;
import com.agrocontrol.rol.domain.RolRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RolConfig {

    @Bean
    public RolService rolService(RolRepository rolRepository) {
        return new RolService(rolRepository);
    }
}
