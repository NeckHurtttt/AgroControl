package com.agrocontrol.predio.infra.web;

import com.agrocontrol.predio.application.PredioService;
import com.agrocontrol.predio.domain.Predio;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/predios")
public class PredioController {

    private final PredioService predioService;

    public PredioController(PredioService predioService) {
        this.predioService = predioService;
    }

    @GetMapping
    public List<PredioResponse> listar() {
        return predioService.listar().stream().map(PredioResponse::desde).toList();
    }

    @GetMapping("/{id}")
    public PredioResponse obtener(@PathVariable Long id) {
        return PredioResponse.desde(predioService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<PredioResponse> crear(@Valid @RequestBody PredioRequest request) {
        Predio creado = predioService.crear(
                request.nombre(),
                request.ubicacion(),
                request.areaHa(),
                request.activo() == null || request.activo()
        );
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creado.getId()).toUri();
        return ResponseEntity.created(location).body(PredioResponse.desde(creado));
    }
}
