package com.agrocontrol.cosecha.application;

import com.agrocontrol.campana.domain.Campana;
import com.agrocontrol.campana.domain.CampanaRepository;
import com.agrocontrol.cosecha.domain.Cosecha;
import com.agrocontrol.cosecha.domain.CosechaRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import com.agrocontrol.usuario.domain.exception.UsuarioNoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public class CosechaService {

    private final CosechaRepository cosechaRepository;
    private final CampanaRepository campanaRepository;
    private final UsuarioRepository usuarioRepository;

    public CosechaService(CosechaRepository cosechaRepository, CampanaRepository campanaRepository,
                          UsuarioRepository usuarioRepository) {
        this.cosechaRepository = cosechaRepository;
        this.campanaRepository = campanaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Cosecha> listar(Long campanaId) {
        if (campanaId == null) {
            return cosechaRepository.listarTodas();
        }
        return cosechaRepository.listarPorCampana(campanaId);
    }

    @Transactional
    public Cosecha registrar(Long campanaId, BigDecimal cantidad, String unidadMedida, Long usuarioId) {
        Campana campana = campanaRepository.buscarPorId(campanaId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la campaña con id: " + campanaId));
        if ("PLANIFICADA".equals(campana.getEstado())) {
            throw new ConflictoException("No se puede cosechar una campaña que todavía no se inició");
        }
        if (usuarioRepository.buscarPorId(usuarioId).isEmpty()) {
            throw new UsuarioNoEncontradoException(usuarioId);
        }
        return cosechaRepository.guardar(new Cosecha(null, campanaId, cantidad, unidadMedida.trim(), usuarioId));
    }
}
