package com.agrocontrol.predio.infrastructure.config;

import com.agrocontrol.parcela.domain.ParcelaRepository;
import com.agrocontrol.predio.application.PredioService;
import com.agrocontrol.predio.domain.PredioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PredioConfig {

    @Bean
    public PredioService predioService(PredioRepository predioRepository, ParcelaRepository parcelaRepository) {
        return new PredioService(predioRepository, parcelaRepository);
    }
}
