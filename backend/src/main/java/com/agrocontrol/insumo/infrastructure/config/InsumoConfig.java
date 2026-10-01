package com.agrocontrol.insumo.infrastructure.config;

import com.agrocontrol.insumo.application.InventarioService;
import com.agrocontrol.insumo.domain.ConsumoLaborRepository;
import com.agrocontrol.insumo.domain.InsumoRepository;
import com.agrocontrol.insumo.domain.MovimientoInsumoRepository;
import com.agrocontrol.labor.domain.LaborRepository;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class InsumoConfig {

    @Bean
    public InventarioService inventarioService(InsumoRepository insumoRepository,
                                               MovimientoInsumoRepository movimientoRepository,
                                               ConsumoLaborRepository consumoRepository,
                                               LaborRepository laborRepository,
                                               UsuarioRepository usuarioRepository) {
        return new InventarioService(insumoRepository, movimientoRepository, consumoRepository,
                laborRepository, usuarioRepository);
    }
}
