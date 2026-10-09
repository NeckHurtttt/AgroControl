package com.agrocontrol;

import com.agrocontrol.rol.domain.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AgroControlApplication {

    public static void main(String[] args) {
        SpringApplication.run(AgroControlApplication.class, args);
    }

    @Bean
    CommandLineRunner alIniciar(RolRepository rolRepository) {
        return args -> System.out.println(
                "Conectado a PostgreSQL (esquema agrocontrol). Roles registrados: " + rolRepository.listarTodos().size()
        );
    }
}
