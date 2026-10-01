package com.agrocontrol.predio.infrastructure.adapter.in.web;

import com.agrocontrol.predio.application.PredioService;
import com.agrocontrol.predio.domain.Predio;
import com.agrocontrol.predio.infrastructure.adapter.in.web.dto.PredioRequest;
import com.agrocontrol.predio.infrastructure.adapter.in.web.dto.PredioResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/predios")
public class PredioController {

    private final PredioService service;

    public PredioController(PredioService service) {
        this.service = service;
    }

    @GetMapping
    public List<PredioResponse> listar() {
        return service.listar().stream().map(PredioResponse::desde).toList();
    }

    @GetMapping("/{id}")
    public PredioResponse buscarPorId(@PathVariable Long id) {
        return PredioResponse.desde(service.obtener(id));
    }

    @PostMapping
    public ResponseEntity<PredioResponse> crear(@Valid @RequestBody PredioRequest request) {
        Predio creado = service.crear(request.nombre(), request.ubicacion(), request.areaHa(), request.activoONulo());
        return ResponseEntity.status(HttpStatus.CREATED).body(PredioResponse.desde(creado));
    }

    @PutMapping("/{id}")
    public PredioResponse actualizar(@PathVariable Long id, @Valid @RequestBody PredioRequest request) {
        return PredioResponse.desde(service.actualizar(
                id, request.nombre(), request.ubicacion(), request.areaHa(), request.activoONulo()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
