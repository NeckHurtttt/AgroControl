package com.agrocontrol.rol.infrastructure.adapter.in.web;

import com.agrocontrol.rol.application.demo.RolDemoResponse;
import com.agrocontrol.rol.application.demo.RolDemoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
public class RolDemoController {

    private final RolDemoService service;

    public RolDemoController(RolDemoService service) {
        this.service = service;
    }

    @GetMapping("/demo")
    public RolDemoResponse demo() {
        return service.obtenerDemo();
    }
}
