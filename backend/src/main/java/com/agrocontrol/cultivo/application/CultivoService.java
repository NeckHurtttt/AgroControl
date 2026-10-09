package com.agrocontrol.cultivo.application;

import com.agrocontrol.cultivo.domain.Cultivo;
import com.agrocontrol.cultivo.domain.CultivoRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public class CultivoService {

    private final CultivoRepository cultivoRepository;

    public CultivoService(CultivoRepository cultivoRepository) {
        this.cultivoRepository = cultivoRepository;
    }

    @Transactional(readOnly = true)
    public List<Cultivo> listar() {
        return cultivoRepository.listarTodos();
    }

    @Transactional
    public Cultivo crear(String nombre, Integer cicloDias) {
        String nombreLimpio = nombre.trim();
        if (cultivoRepository.existePorNombre(nombreLimpio)) {
            throw new ConflictoException("Ya existe un cultivo llamado " + nombreLimpio);
        }
        return cultivoRepository.guardar(new Cultivo(null, nombreLimpio, cicloDias));
    }
}
