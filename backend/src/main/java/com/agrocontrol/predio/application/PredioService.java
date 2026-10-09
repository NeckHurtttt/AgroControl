package com.agrocontrol.predio.application;

import com.agrocontrol.parcela.domain.ParcelaRepository;
import com.agrocontrol.predio.domain.Predio;
import com.agrocontrol.predio.domain.PredioRepository;
import com.agrocontrol.shared.domain.ConflictoException;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public class PredioService {

    private final PredioRepository predioRepository;
    private final ParcelaRepository parcelaRepository;

    public PredioService(PredioRepository predioRepository, ParcelaRepository parcelaRepository) {
        this.predioRepository = predioRepository;
        this.parcelaRepository = parcelaRepository;
    }

    @Transactional(readOnly = true)
    public List<Predio> listar() {
        return predioRepository.listarTodos();
    }

    @Transactional(readOnly = true)
    public Predio obtener(Long id) {
        return predioRepository.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el predio con id: " + id));
    }

    @Transactional
    public Predio crear(String nombre, String ubicacion, BigDecimal areaHa, boolean activo) {
        Predio predio = new Predio(null, nombre.trim(), ubicacion, areaHa);
        if (!activo) {
            predio.desactivar();
        }
        return predioRepository.guardar(predio);
    }

    @Transactional
    public Predio actualizar(Long id, String nombre, String ubicacion, BigDecimal areaHa, boolean activo) {
        // Entidad gestionada: los cambios se escriben con UPDATE por dirty checking al cerrar la transacción
        Predio predio = obtener(id);
        predio.renombrar(nombre.trim());
        predio.actualizarUbicacion(ubicacion);
        predio.actualizarArea(areaHa);
        if (activo) {
            predio.activar();
        } else {
            predio.desactivar();
        }
        return predio;
    }

    @Transactional
    public void eliminar(Long id) {
        obtener(id);
        // Sin cascade: las parcelas tienen campañas e historial, no se borran junto con el predio
        if (parcelaRepository.existePorPredio(id)) {
            throw new ConflictoException("No se puede eliminar el predio " + id + " porque tiene parcelas registradas");
        }
        predioRepository.eliminar(id);
    }
}
