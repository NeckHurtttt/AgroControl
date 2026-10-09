package com.agrocontrol.rol.infrastructure.adapter.out.persistence;

import com.agrocontrol.usuario.infrastructure.adapter.out.persistence.UsuarioJpaEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Table(name = "rol", schema = "agrocontrol")
public class RolJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @Column(name = "descripcion", length = 200)
    private String descripcion;

    // Lado inverso: la FK la controla UsuarioJpaEntity.rol (lado propietario).
    // Sin cascade ni orphanRemoval: un usuario no nace ni muere con su rol.
    @OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
    private List<UsuarioJpaEntity> usuarios = new ArrayList<>();

    protected RolJpaEntity() {
    }

    public RolJpaEntity(Long id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public List<UsuarioJpaEntity> getUsuarios() { return Collections.unmodifiableList(usuarios); }
}
