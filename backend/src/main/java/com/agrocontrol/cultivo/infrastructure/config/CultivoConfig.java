package com.agrocontrol.cultivo.infrastructure.config;

import com.agrocontrol.cultivo.application.CultivoService;
import com.agrocontrol.cultivo.domain.CultivoRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CultivoConfig {

    @Bean
    public CultivoService cultivoService(CultivoRepository cultivoRepository) {
        return new CultivoService(cultivoRepository);
    }
}
