package com.agrocontrol.rol.infrastructure.adapter.in.web;

import com.agrocontrol.rol.application.RolService;
import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.rol.infrastructure.adapter.in.web.dto.CrearRolRequest;
import com.agrocontrol.rol.infrastructure.adapter.in.web.dto.RolResponse;
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
@RequestMapping("/api/roles")
public class RolController {

    private final RolService service;

    public RolController(RolService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RolResponse> crear(@Valid @RequestBody CrearRolRequest request) {
        Rol creado = service.registrar(new Rol(null, request.nombre(), request.descripcion()));
        return ResponseEntity.status(HttpStatus.CREATED).body(RolResponse.desde(creado));
    }

    @GetMapping
    public List<RolResponse> listar(@RequestParam(required = false) String nombre) {
        return service.listar().stream()
                .filter(rol -> nombre == null || rol.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .map(RolResponse::desde)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(RolResponse.desde(service.obtener(id)));
    }

}
