package com.agrocontrol.auditoria.infrastructure.adapter.in.web;

import com.agrocontrol.auditoria.application.AuditoriaService;
import com.agrocontrol.auditoria.infrastructure.adapter.in.web.dto.AuditoriaResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// RF-16: consulta de cambios críticos (solo ADMINISTRADOR, ver SecurityConfig)
@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

    private final AuditoriaService service;

    public AuditoriaController(AuditoriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<AuditoriaResponse> listar(@RequestParam(required = false) String entidad,
                                          @RequestParam(required = false) Long idEntidad) {
        return service.listar(entidad, idEntidad).stream().map(AuditoriaResponse::desde).toList();
    }
}
