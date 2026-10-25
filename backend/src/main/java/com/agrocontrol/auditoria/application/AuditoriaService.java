package com.agrocontrol.auditoria.application;

import com.agrocontrol.auditoria.domain.Auditoria;
import com.agrocontrol.auditoria.domain.AuditoriaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public class AuditoriaService {

    // La consulta muestra los últimos movimientos, no el histórico completo
    private static final int LIMITE = 500;

    private final AuditoriaRepository repository;

    public AuditoriaService(AuditoriaRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Auditoria registrar(Long usuarioId, String entidad, Long idEntidad, String accion, String detalle) {
        return repository.guardar(new Auditoria(usuarioId, entidad, idEntidad, accion, detalle));
    }

    @Transactional(readOnly = true)
    public List<Auditoria> listar(String entidad, Long idEntidad) {
        String filtro = entidad == null || entidad.isBlank() ? null : entidad.trim().toUpperCase();
        return repository.listar(filtro, idEntidad, LIMITE);
    }
}
