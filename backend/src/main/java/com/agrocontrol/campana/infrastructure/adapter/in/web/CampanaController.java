package com.agrocontrol.campana.infrastructure.adapter.in.web;

import com.agrocontrol.campana.application.AvanceCampana;
import com.agrocontrol.campana.application.AvanceCampanaService;
import com.agrocontrol.campana.application.CampanaService;
import com.agrocontrol.campana.infrastructure.adapter.in.web.dto.CampanaResponse;
import com.agrocontrol.campana.infrastructure.adapter.in.web.dto.CrearCampanaRequest;
import com.agrocontrol.campana.infrastructure.adapter.in.web.dto.FinalizarCampanaRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/campanas")
public class CampanaController {

    private final CampanaService service;
    private final AvanceCampanaService avanceService;

    public CampanaController(CampanaService service, AvanceCampanaService avanceService) {
        this.service = service;
        this.avanceService = avanceService;
    }

    @GetMapping
    public List<CampanaResponse> listar(@RequestParam(required = false) Long parcelaId) {
        return service.listar(parcelaId).stream().map(CampanaResponse::desde).toList();
    }

    @GetMapping("/{id}")
    public CampanaResponse buscarPorId(@PathVariable Long id) {
        return CampanaResponse.desde(service.obtener(id));
    }

    @PostMapping
    public ResponseEntity<CampanaResponse> crear(@Valid @RequestBody CrearCampanaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(CampanaResponse.desde(
                service.crear(request.parcelaId(), request.cultivoId(), request.fechaInicio())));
    }

    // Transiciones de estado como acciones: no es un PUT del recurso completo.
    @PostMapping("/{id}/iniciar")
    public CampanaResponse iniciar(@PathVariable Long id) {
        return CampanaResponse.desde(service.iniciar(id));
    }

    @PostMapping("/{id}/finalizar")
    public CampanaResponse finalizar(@PathVariable Long id, @Valid @RequestBody FinalizarCampanaRequest request) {
        return CampanaResponse.desde(service.finalizar(id, request.fechaFin()));
    }

    // RF-15: labores hechas, insumos gastados, cosecha y problemas abiertos de la campaña
    @GetMapping("/{id}/avance")
    public AvanceCampana avance(@PathVariable Long id) {
        return avanceService.calcular(id, LocalDate.now());
    }
}
