package com.agrocontrol.labor.infrastructure.config;

import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.labor.application.LaborService;
import com.agrocontrol.labor.domain.LaborRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LaborConfig {

    @Bean
    public LaborService laborService(LaborRepository laborRepository, CampanaRepository campanaRepository) {
        return new LaborService(laborRepository, campanaRepository);
    }
}
