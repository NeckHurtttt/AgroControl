package com.agrocontrol.campana.infrastructure.config;

import com.agrocontrol.campana.application.CampanaService;
import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.cultivo.domain.CultivoRepository;
import com.agrocontrol.parcela.domain.ParcelaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CampanaConfig {

    @Bean
    public CampanaService campanaService(CampanaRepository campanaRepository, ParcelaRepository parcelaRepository,
                                         CultivoRepository cultivoRepository) {
        return new CampanaService(campanaRepository, parcelaRepository, cultivoRepository);
    }
}
