package com.agrocontrol.bitacora.infrastructure.config;

import com.agrocontrol.bitacora.application.BitacoraService;
import com.agrocontrol.bitacora.domain.BitacoraRepository;
import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.labor.domain.LaborRepository;
import com.agrocontrol.parcela.domain.ParcelaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BitacoraConfig {

    @Bean
    public BitacoraService bitacoraService(BitacoraRepository bitacoraRepository, LaborRepository laborRepository,
                                           CampanaRepository campanaRepository, ParcelaRepository parcelaRepository) {
        return new BitacoraService(bitacoraRepository, laborRepository, campanaRepository, parcelaRepository);
    }
}
