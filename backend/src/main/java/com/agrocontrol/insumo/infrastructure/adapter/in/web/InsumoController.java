package com.agrocontrol.insumo.infrastructure.adapter.in.web;

import com.agrocontrol.insumo.application.InventarioService;
import com.agrocontrol.insumo.infrastructure.adapter.in.web.dto.CrearInsumoRequest;
import com.agrocontrol.insumo.infrastructure.adapter.in.web.dto.InsumoResponse;
import com.agrocontrol.insumo.infrastructure.adapter.in.web.dto.MovimientoResponse;
import com.agrocontrol.insumo.infrastructure.adapter.in.web.dto.RegistrarMovimientoRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/insumos")
public class InsumoController {

    private final InventarioService service;

    public InsumoController(InventarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<InsumoResponse> listar() {
        return service.listarInsumos().stream().map(InsumoResponse::desde).toList();
    }

    @GetMapping("/{id}")
    public InsumoResponse buscarPorId(@PathVariable Long id) {
        return InsumoResponse.desde(service.obtenerInsumo(id));
    }

    @PostMapping
    public ResponseEntity<InsumoResponse> crear(@Valid @RequestBody CrearInsumoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(InsumoResponse.desde(service.crearInsumo(request.nombre(), request.unidadMedida())));
    }

    @GetMapping("/{id}/movimientos")
    public List<MovimientoResponse> listarMovimientos(@PathVariable Long id) {
        return service.listarMovimientos(id).stream().map(MovimientoResponse::desde).toList();
    }

    @PostMapping("/{id}/movimientos")
    public ResponseEntity<MovimientoResponse> registrarMovimiento(@PathVariable Long id,
                                                                  @Valid @RequestBody RegistrarMovimientoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(MovimientoResponse.desde(service.registrarMovimiento(
                id, request.tipo(), request.cantidad(), request.motivo(), request.usuarioId())));
    }
}
