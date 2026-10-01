package com.agrocontrol.rol.application.demo;

import org.springframework.stereotype.Service;

@Service
public class RolDemoService {

    public RolDemoResponse obtenerDemo() {
        return new RolDemoResponse(
                1L,
                "JEFE_DE_CAMPO",
                "Planifica campañas y asigna labores a los operarios",
                3
        );
    }
}
