package com.agrocontrol.auditoria.domain;

import java.util.List;

public interface AuditoriaRepository {
    Auditoria guardar(Auditoria auditoria);
    // entidad e idEntidad son filtros opcionales (null = todos); de lo más reciente a lo más antiguo
    List<Auditoria> listar(String entidad, Long idEntidad, int limite);
}
