package com.agrocontrol.auditoria.infrastructure.config;

import com.agrocontrol.auditoria.application.AuditoriaService;
import com.agrocontrol.auditoria.domain.AuditoriaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuditoriaConfig {

    @Bean
    public AuditoriaService auditoriaService(AuditoriaRepository auditoriaRepository) {
        return new AuditoriaService(auditoriaRepository);
    }
}
