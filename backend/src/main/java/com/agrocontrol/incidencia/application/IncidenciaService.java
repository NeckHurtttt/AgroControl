package com.agrocontrol.incidencia.application;

import com.agrocontrol.campana.domain.Campana;
import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.incidencia.domain.Incidencia;
import com.agrocontrol.incidencia.domain.IncidenciaRepository;
import com.agrocontrol.labor.domain.Labor;
import com.agrocontrol.labor.domain.LaborRepository;
import com.agrocontrol.parcela.domain.ParcelaRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import com.agrocontrol.usuario.domain.exception.UsuarioNoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

public class IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;
    private final ParcelaRepository parcelaRepository;
    private final CampanaRepository campanaRepository;
    private final LaborRepository laborRepository;
    private final UsuarioRepository usuarioRepository;

    public IncidenciaService(IncidenciaRepository incidenciaRepository, ParcelaRepository parcelaRepository,
                             CampanaRepository campanaRepository, LaborRepository laborRepository,
                             UsuarioRepository usuarioRepository) {
        this.incidenciaRepository = incidenciaRepository;
        this.parcelaRepository = parcelaRepository;
        this.campanaRepository = campanaRepository;
        this.laborRepository = laborRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Incidencia> listar(Long parcelaId) {
        if (parcelaId == null) {
            return incidenciaRepository.listarTodas();
        }
        return incidenciaRepository.listarPorParcela(parcelaId);
    }

    // La incidencia se reporta sobre una labor, una campaña o una parcela (al menos una).
    // Lo que no se envía se deduce del nivel más específico: labor -> campaña -> parcela,
    // y si se envía, debe coincidir con lo deducido.
    @Transactional
    public Incidencia registrar(Long parcelaId, Long campanaId, Long laborId, String descripcion, Long usuarioId) {
        if (parcelaId == null && campanaId == null && laborId == null) {
            throw new IllegalArgumentException("La incidencia debe referirse a una parcela, una campaña o una labor");
        }
        if (laborId != null) {
            Labor labor = laborRepository.buscarPorId(laborId)
                    .orElseThrow(() -> new RecursoNoEncontradoException("No existe la labor con id: " + laborId));
            campanaId = coincidir(campanaId, labor.getCampanaId(), "La labor " + laborId + " no pertenece a la campaña " + campanaId);
            parcelaId = coincidir(parcelaId, labor.getParcelaId(), "La labor " + laborId + " no pertenece a la parcela " + parcelaId);
        }
        if (campanaId != null) {
            Long id = campanaId;
            Campana campana = campanaRepository.buscarPorId(id)
                    .orElseThrow(() -> new RecursoNoEncontradoException("No existe la campaña con id: " + id));
            parcelaId = coincidir(parcelaId, campana.getParcelaId(), "La campaña " + id + " no pertenece a la parcela " + parcelaId);
        }
        Long idParcela = parcelaId;
        if (parcelaRepository.buscarPorId(idParcela).isEmpty()) {
            throw new RecursoNoEncontradoException("No existe la parcela con id: " + idParcela);
        }
        if (usuarioRepository.buscarPorId(usuarioId).isEmpty()) {
            throw new UsuarioNoEncontradoException(usuarioId);
        }
        return incidenciaRepository.guardar(new Incidencia(null, parcelaId, campanaId, laborId, descripcion.trim(), usuarioId));
    }

    private static Long coincidir(Long enviado, Long deducido, String mensaje) {
        if (enviado != null && !Objects.equals(enviado, deducido)) {
            throw new ConflictoException(mensaje);
        }
        return deducido;
    }
}
