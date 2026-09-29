package com.agrocontrol.rol.infrastructure.adapter.out.persistence;

import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.rol.domain.RolRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RolPersistenceAdapter implements RolRepository {

    private final RolJpaRepository jpaRepository;

    public RolPersistenceAdapter(RolJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Rol guardar(Rol rol) {
        RolJpaEntity guardado = jpaRepository.save(RolPersistenceMapper.toEntity(rol));
        return RolPersistenceMapper.toDomain(guardado);
    }

    @Override
    public Optional<Rol> buscarPorId(Long id) {
        return jpaRepository.findById(id).map(RolPersistenceMapper::toDomain);
    }

    @Override
    public List<Rol> listarTodos() {
        return jpaRepository.findAll().stream()
                .map(RolPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public boolean existePorNombre(String nombre) {
        return jpaRepository.existsByNombreIgnoreCase(nombre);
    }
}
