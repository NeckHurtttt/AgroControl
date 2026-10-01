package com.agrocontrol.parcela.infra.web;

import com.agrocontrol.parcela.application.ParcelaService;
import com.agrocontrol.parcela.domain.Parcela;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/parcelas")
public class ParcelaController {

    private final ParcelaService parcelaService;

    public ParcelaController(ParcelaService parcelaService) {
        this.parcelaService = parcelaService;
    }

    @GetMapping
    public List<ParcelaResponse> listar(@RequestParam(required = false) Long predioId) {
        return parcelaService.listar(predioId).stream().map(ParcelaResponse::desde).toList();
    }

    @GetMapping("/{id}")
    public ParcelaResponse obtener(@PathVariable Long id) {
        return ParcelaResponse.desde(parcelaService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<ParcelaResponse> crear(@Valid @RequestBody ParcelaRequest request) {
        Parcela creada = parcelaService.crear(request.predioId(), request.codigo(), request.areaHa());
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creada.getId()).toUri();
        return ResponseEntity.created(location).body(ParcelaResponse.desde(creada));
    }
}
