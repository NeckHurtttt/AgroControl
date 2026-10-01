package com.agrocontrol.campana.application;

import com.agrocontrol.campana.domain.Campana;
import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.cultivo.domain.CultivoRepository;
import com.agrocontrol.parcela.domain.ParcelaRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public class CampanaService {

    private final CampanaRepository campanaRepository;
    private final ParcelaRepository parcelaRepository;
    private final CultivoRepository cultivoRepository;

    public CampanaService(CampanaRepository campanaRepository, ParcelaRepository parcelaRepository,
                          CultivoRepository cultivoRepository) {
        this.campanaRepository = campanaRepository;
        this.parcelaRepository = parcelaRepository;
        this.cultivoRepository = cultivoRepository;
    }

    @Transactional(readOnly = true)
    public List<Campana> listar(Long parcelaId) {
        if (parcelaId == null) {
            return campanaRepository.listarTodas();
        }
        return campanaRepository.listarPorParcela(parcelaId);
    }

    @Transactional(readOnly = true)
    public Campana obtener(Long id) {
        return campanaRepository.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la campaña con id: " + id));
    }

    @Transactional
    public Campana crear(Long parcelaId, Long cultivoId, LocalDate fechaInicio) {
        if (parcelaRepository.buscarPorId(parcelaId).isEmpty()) {
            throw new RecursoNoEncontradoException("No existe la parcela con id: " + parcelaId);
        }
        if (!cultivoRepository.existePorId(cultivoId)) {
            throw new RecursoNoEncontradoException("No existe el cultivo con id: " + cultivoId);
        }
        // Regla de negocio: una parcela trabaja una sola campaña a la vez
        if (campanaRepository.existeAbiertaEnParcela(parcelaId)) {
            throw new ConflictoException("La parcela " + parcelaId + " ya tiene una campaña sin finalizar");
        }
        return campanaRepository.guardar(new Campana(null, parcelaId, cultivoId, fechaInicio));
    }

    @Transactional
    public Campana iniciar(Long id) {
        Campana campana = obtener(id);
        campana.iniciar();
        return campana;
    }

    @Transactional
    public Campana finalizar(Long id, LocalDate fechaFin) {
        Campana campana = obtener(id);
        campana.finalizar(fechaFin);
        return campana;
    }
}
