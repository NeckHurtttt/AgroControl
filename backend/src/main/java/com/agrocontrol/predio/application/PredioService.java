package com.agrocontrol.predio.application;

import com.agrocontrol.predio.domain.Predio;
import com.agrocontrol.predio.domain.PredioRepository;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PredioService {

    private final PredioRepository predioRepository;

    public PredioService(PredioRepository predioRepository) {
        this.predioRepository = predioRepository;
    }

    @Transactional(readOnly = true)
    public List<Predio> listar() {
        return predioRepository.listarTodos();
    }

    @Transactional(readOnly = true)
    public Predio obtener(Long id) {
        return predioRepository.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el predio con id " + id));
    }

    @Transactional
    public Predio crear(String nombre, String ubicacion, BigDecimal areaHa, boolean activo) {
        Predio predio = new Predio(null, nombre.trim(), ubicacion, areaHa);
        if (!activo) {
            predio.desactivar();
        }
        return predioRepository.guardar(predio);
    }
}
