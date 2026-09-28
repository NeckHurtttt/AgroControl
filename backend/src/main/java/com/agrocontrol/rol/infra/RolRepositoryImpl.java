package com.agrocontrol.rol.infra;

import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.rol.domain.RolRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RolRepositoryImpl implements RolRepository {

    private final RolJpaRepository jpaRepository;

    public RolRepositoryImpl(RolJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Rol guardar(Rol rol) {
        return jpaRepository.save(rol);
    }

    @Override
    public Optional<Rol> buscarPorId(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Rol> listarTodos() {
        return jpaRepository.findAll();
    }
}
