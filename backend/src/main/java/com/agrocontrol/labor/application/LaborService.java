package com.agrocontrol.labor.application;

import com.agrocontrol.campana.domain.Campana;
import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.labor.domain.Labor;
import com.agrocontrol.labor.domain.LaborRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public class LaborService {

    private final LaborRepository laborRepository;
    private final CampanaRepository campanaRepository;

    public LaborService(LaborRepository laborRepository, CampanaRepository campanaRepository) {
        this.laborRepository = laborRepository;
        this.campanaRepository = campanaRepository;
    }

    @Transactional(readOnly = true)
    public List<Labor> listar(Long campanaId) {
        if (campanaId == null) {
            return laborRepository.listarTodas();
        }
        return laborRepository.listarPorCampana(campanaId);
    }

    @Transactional(readOnly = true)
    public Labor obtener(Long id) {
        return laborRepository.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la labor con id: " + id));
    }

    @Transactional
    public Labor planificar(Long campanaId, String tipo, LocalDate fechaPlan) {
        Campana campana = campanaRepository.buscarPorId(campanaId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la campaña con id: " + campanaId));
        if (campana.estaFinalizada()) {
            throw new ConflictoException("No se pueden planificar labores en una campaña finalizada");
        }
        // La parcela se toma de la campaña: el cliente no puede enviar una parcela distinta
        return laborRepository.guardar(
                new Labor(null, campanaId, campana.getParcelaId(), tipo.trim().toUpperCase(), fechaPlan));
    }

    @Transactional
    public Labor ejecutar(Long id, LocalDate fechaEjecucion) {
        Labor labor = obtener(id);
        labor.ejecutar(fechaEjecucion);
        return labor;
    }
}
