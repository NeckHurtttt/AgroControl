package com.agrocontrol.rol.infrastructure.memory;

import com.agrocontrol.rol.domain.Rol;
import com.agrocontrol.rol.domain.RolRepository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

public class RolRepositoryEnMemoria implements RolRepository {

    private final Map<Long, Rol> datos = new LinkedHashMap<>();
    private final AtomicLong secuencia = new AtomicLong(0);

    @Override
    public Rol guardar(Rol rol) {
        Rol aGuardar = rol.getId() != null
                ? rol
                : new Rol(secuencia.incrementAndGet(), rol.getNombre(), rol.getDescripcion());
        secuencia.accumulateAndGet(aGuardar.getId(), Math::max);
        datos.put(aGuardar.getId(), aGuardar);
        return aGuardar;
    }

    @Override
    public Optional<Rol> buscarPorId(Long id) {
        return Optional.ofNullable(datos.get(id));
    }

    @Override
    public List<Rol> listarTodos() {
        return new ArrayList<>(datos.values());
    }

    @Override
    public boolean existePorNombre(String nombre) {
        return datos.values().stream()
                .anyMatch(r -> r.getNombre().equalsIgnoreCase(nombre));
    }
}
