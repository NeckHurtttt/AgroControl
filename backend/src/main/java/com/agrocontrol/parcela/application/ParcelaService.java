package com.agrocontrol.parcela.application;

import com.agrocontrol.parcela.domain.Parcela;
import com.agrocontrol.parcela.domain.ParcelaRepository;
import com.agrocontrol.predio.domain.PredioRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ParcelaService {

    private final ParcelaRepository parcelaRepository;
    private final PredioRepository predioRepository;

    public ParcelaService(ParcelaRepository parcelaRepository, PredioRepository predioRepository) {
        this.parcelaRepository = parcelaRepository;
        this.predioRepository = predioRepository;
    }

    @Transactional(readOnly = true)
    public List<Parcela> listar(Long predioId) {
        if (predioId == null) {
            return parcelaRepository.listarTodas();
        }
        return parcelaRepository.listarPorPredio(predioId);
    }

    @Transactional(readOnly = true)
    public Parcela obtener(Long id) {
        return parcelaRepository.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la parcela con id " + id));
    }

    @Transactional
    public Parcela crear(Long predioId, String codigo, BigDecimal areaHa) {
        if (!predioRepository.existePorId(predioId)) {
            throw new RecursoNoEncontradoException("No existe el predio con id " + predioId);
        }
        String codigoNormalizado = codigo.trim().toUpperCase();
        if (parcelaRepository.existeCodigoEnPredio(predioId, codigoNormalizado)) {
            throw new ConflictoException("Ya existe una parcela con el código " + codigoNormalizado + " en este predio.");
        }
        return parcelaRepository.guardar(new Parcela(null, predioId, codigoNormalizado, areaHa));
    }
}
