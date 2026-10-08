package com.agrocontrol.parcela.infrastructure.adapter.in.web;

import com.agrocontrol.parcela.application.ParcelaService;
import com.agrocontrol.parcela.domain.Parcela;
import com.agrocontrol.parcela.infrastructure.adapter.in.web.dto.ActualizarParcelaRequest;
import com.agrocontrol.parcela.infrastructure.adapter.in.web.dto.CrearParcelaRequest;
import com.agrocontrol.parcela.infrastructure.adapter.in.web.dto.ParcelaResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/parcelas")
public class ParcelaController {

    private final ParcelaService service;

    public ParcelaController(ParcelaService service) {
        this.service = service;
    }

    @GetMapping
    public List<ParcelaResponse> listar(@RequestParam(required = false) Long predioId) {
        return service.listar(predioId).stream().map(ParcelaResponse::desde).toList();
    }

    @GetMapping("/{id}")
    public ParcelaResponse buscarPorId(@PathVariable Long id) {
        return ParcelaResponse.desde(service.obtener(id));
    }

    @PostMapping
    public ResponseEntity<ParcelaResponse> crear(@Valid @RequestBody CrearParcelaRequest request) {
        Parcela creada = service.crear(request.predioId(), request.codigo(), request.areaHa());
        return ResponseEntity.status(HttpStatus.CREATED).body(ParcelaResponse.desde(creada));
    }

    @PutMapping("/{id}")
    public ParcelaResponse actualizar(@PathVariable Long id, @Valid @RequestBody ActualizarParcelaRequest request) {
        return ParcelaResponse.desde(service.actualizar(
                id, request.predioId(), request.codigo(), request.areaHa(), request.estado()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
