package com.agrocontrol.labor.infrastructure.adapter.in.web;

import com.agrocontrol.insumo.application.InventarioService;
import com.agrocontrol.labor.application.LaborService;
import com.agrocontrol.labor.infrastructure.adapter.in.web.dto.ConsumoResponse;
import com.agrocontrol.labor.infrastructure.adapter.in.web.dto.EjecutarLaborRequest;
import com.agrocontrol.labor.infrastructure.adapter.in.web.dto.LaborResponse;
import com.agrocontrol.labor.infrastructure.adapter.in.web.dto.PlanificarLaborRequest;
import com.agrocontrol.labor.infrastructure.adapter.in.web.dto.RegistrarConsumoRequest;
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

import java.util.List;

@RestController
@RequestMapping("/api/labores")
public class LaborController {

    private final LaborService laborService;
    private final InventarioService inventarioService;

    public LaborController(LaborService laborService, InventarioService inventarioService) {
        this.laborService = laborService;
        this.inventarioService = inventarioService;
    }

    @GetMapping
    public List<LaborResponse> listar(@RequestParam(required = false) Long campanaId) {
        return laborService.listar(campanaId).stream().map(LaborResponse::desde).toList();
    }

    @GetMapping("/{id}")
    public LaborResponse buscarPorId(@PathVariable Long id) {
        return LaborResponse.desde(laborService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<LaborResponse> planificar(@Valid @RequestBody PlanificarLaborRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(LaborResponse.desde(
                laborService.planificar(request.campanaId(), request.tipo(), request.fechaPlan())));
    }

    @PostMapping("/{id}/ejecutar")
    public LaborResponse ejecutar(@PathVariable Long id, @Valid @RequestBody EjecutarLaborRequest request) {
        return LaborResponse.desde(laborService.ejecutar(id, request.fechaEjecucion()));
    }

    // Insumos usados en la labor: cada consumo descuenta stock y deja un movimiento de SALIDA.
    @GetMapping("/{id}/consumos")
    public List<ConsumoResponse> listarConsumos(@PathVariable Long id) {
        return inventarioService.listarConsumos(id).stream().map(ConsumoResponse::desde).toList();
    }

    @PostMapping("/{id}/consumos")
    public ResponseEntity<ConsumoResponse> registrarConsumo(@PathVariable Long id,
                                                            @Valid @RequestBody RegistrarConsumoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ConsumoResponse.desde(
                inventarioService.registrarConsumo(id, request.insumoId(), request.cantidad(), request.usuarioId())));
    }
}
