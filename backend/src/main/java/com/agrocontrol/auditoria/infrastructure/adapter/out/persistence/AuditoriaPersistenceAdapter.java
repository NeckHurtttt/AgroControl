package com.agrocontrol.auditoria.infrastructure.adapter.out.persistence;

import com.agrocontrol.auditoria.domain.Auditoria;
import com.agrocontrol.auditoria.domain.AuditoriaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AuditoriaPersistenceAdapter implements AuditoriaRepository {

    private final AuditoriaJpaRepository jpaRepository;

    public AuditoriaPersistenceAdapter(AuditoriaJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Auditoria guardar(Auditoria auditoria) {
        return AuditoriaPersistenceMapper.toDomain(jpaRepository.save(AuditoriaPersistenceMapper.toEntity(auditoria)));
    }

    @Override
    public List<Auditoria> listar(String entidad, Long idEntidad, int limite) {
        return jpaRepository.buscar(entidad, idEntidad, PageRequest.of(0, limite))
                .stream().map(AuditoriaPersistenceMapper::toDomain).toList();
    }
}
