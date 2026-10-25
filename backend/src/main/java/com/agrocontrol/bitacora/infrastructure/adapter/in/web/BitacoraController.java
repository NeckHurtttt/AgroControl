package com.agrocontrol.bitacora.infrastructure.adapter.in.web;

import com.agrocontrol.auth.infrastructure.security.UsuarioAutenticado;
import com.agrocontrol.bitacora.application.BitacoraService;
import com.agrocontrol.bitacora.infrastructure.adapter.in.web.dto.BitacoraResponse;
import com.agrocontrol.bitacora.infrastructure.adapter.in.web.dto.RegistrarObservacionRequest;
import com.agrocontrol.labor.application.LaborService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// RF-09 (registrar observación de campo) y RF-14 (consultar bitácora por parcela)
@RestController
public class BitacoraController {

    private final BitacoraService service;
    private final LaborService laborService;

    public BitacoraController(BitacoraService service, LaborService laborService) {
        this.service = service;
        this.laborService = laborService;
    }

    @GetMapping("/api/labores/{id}/bitacora")
    public List<BitacoraResponse> listarDeLabor(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        verificarOperario(id, jwt);
        return service.listarPorLabor(id).stream().map(BitacoraResponse::desde).toList();
    }

    @PostMapping("/api/labores/{id}/bitacora")
    public ResponseEntity<BitacoraResponse> registrar(@PathVariable Long id,
                                                      @Valid @RequestBody RegistrarObservacionRequest request,
                                                      @AuthenticationPrincipal Jwt jwt) {
        verificarOperario(id, jwt);
        return ResponseEntity.status(HttpStatus.CREATED).body(BitacoraResponse.desde(
                service.registrar(id, UsuarioAutenticado.id(jwt), request.observacion())));
    }

    @GetMapping("/api/parcelas/{id}/bitacora")
    public List<BitacoraResponse> listarDeParcela(@PathVariable Long id) {
        return service.listarPorParcela(id).stream().map(BitacoraResponse::desde).toList();
    }

    // RN-05: el operario solo escribe y lee la bitácora de sus labores asignadas
    private void verificarOperario(Long laborId, Jwt jwt) {
        if (UsuarioAutenticado.esOperario(jwt)) {
            laborService.verificarAsignacion(laborId, UsuarioAutenticado.id(jwt));
        }
    }
}
