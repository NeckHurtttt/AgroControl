package com.agrocontrol.incidencia.infrastructure.adapter.in.web;

import com.agrocontrol.incidencia.application.IncidenciaService;
import com.agrocontrol.incidencia.infrastructure.adapter.in.web.dto.IncidenciaResponse;
import com.agrocontrol.incidencia.infrastructure.adapter.in.web.dto.RegistrarIncidenciaRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
public class IncidenciaController {

    private final IncidenciaService service;

    public IncidenciaController(IncidenciaService service) {
        this.service = service;
    }

    @GetMapping
    public List<IncidenciaResponse> listar(@RequestParam(required = false) Long parcelaId) {
        return service.listar(parcelaId).stream().map(IncidenciaResponse::desde).toList();
    }

    @PostMapping
    public ResponseEntity<IncidenciaResponse> registrar(@Valid @RequestBody RegistrarIncidenciaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(IncidenciaResponse.desde(service.registrar(
                request.parcelaId(), request.campanaId(), request.laborId(), request.descripcion(), request.usuarioId())));
    }
}
