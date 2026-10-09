package com.agrocontrol.parcela.infrastructure.config;

import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.parcela.application.ParcelaService;
import com.agrocontrol.parcela.domain.ParcelaRepository;
import com.agrocontrol.predio.domain.PredioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ParcelaConfig {

    @Bean
    public ParcelaService parcelaService(ParcelaRepository parcelaRepository, PredioRepository predioRepository,
                                         CampanaRepository campanaRepository) {
        return new ParcelaService(parcelaRepository, predioRepository, campanaRepository);
    }
}
