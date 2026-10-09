package com.agrocontrol.insumo.application;

import com.agrocontrol.insumo.domain.ConsumoLabor;
import com.agrocontrol.insumo.domain.ConsumoLaborRepository;
import com.agrocontrol.insumo.domain.Insumo;
import com.agrocontrol.insumo.domain.InsumoRepository;
import com.agrocontrol.insumo.domain.MovimientoInsumo;
import com.agrocontrol.insumo.domain.MovimientoInsumoRepository;
import com.agrocontrol.insumo.domain.TipoMovimiento;
import com.agrocontrol.labor.domain.Labor;
import com.agrocontrol.labor.domain.LaborRepository;
import com.agrocontrol.shared.domain.RecursoNoEncontradoException;
import com.agrocontrol.usuario.domain.UsuarioRepository;
import com.agrocontrol.usuario.domain.exception.UsuarioNoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public class InventarioService {

    private final InsumoRepository insumoRepository;
    private final MovimientoInsumoRepository movimientoRepository;
    private final ConsumoLaborRepository consumoRepository;
    private final LaborRepository laborRepository;
    private final UsuarioRepository usuarioRepository;

    public InventarioService(InsumoRepository insumoRepository, MovimientoInsumoRepository movimientoRepository,
                             ConsumoLaborRepository consumoRepository, LaborRepository laborRepository,
                             UsuarioRepository usuarioRepository) {
        this.insumoRepository = insumoRepository;
        this.movimientoRepository = movimientoRepository;
        this.consumoRepository = consumoRepository;
        this.laborRepository = laborRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Insumo> listarInsumos() {
        return insumoRepository.listarTodos();
    }

    @Transactional(readOnly = true)
    public Insumo obtenerInsumo(Long id) {
        return insumoRepository.buscarPorId(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe el insumo con id: " + id));
    }

    @Transactional
    public Insumo crearInsumo(String nombre, String unidadMedida) {
        // El stock nace en cero: solo cambia a través de movimientos, para que quede trazado
        return insumoRepository.guardar(new Insumo(null, nombre.trim(), unidadMedida.trim()));
    }

    @Transactional(readOnly = true)
    public List<MovimientoInsumo> listarMovimientos(Long insumoId) {
        obtenerInsumo(insumoId);
        return movimientoRepository.listarPorInsumo(insumoId);
    }

    @Transactional
    public MovimientoInsumo registrarMovimiento(Long insumoId, TipoMovimiento tipo, BigDecimal cantidad,
                                                String motivo, Long usuarioId) {
        Insumo insumo = obtenerInsumo(insumoId);
        verificarUsuario(usuarioId);
        aplicar(insumo, tipo, cantidad);
        return movimientoRepository.guardar(new MovimientoInsumo(null, insumoId, tipo, cantidad, motivo, usuarioId));
    }

    @Transactional(readOnly = true)
    public List<ConsumoLabor> listarConsumos(Long laborId) {
        obtenerLabor(laborId);
        return consumoRepository.listarPorLabor(laborId);
    }

    // Una sola transacción: si falta stock no se guarda ni el consumo ni el movimiento.
    @Transactional
    public ConsumoLabor registrarConsumo(Long laborId, Long insumoId, BigDecimal cantidad, Long usuarioId) {
        Labor labor = obtenerLabor(laborId);
        Insumo insumo = obtenerInsumo(insumoId);
        verificarUsuario(usuarioId);
        insumo.registrarSalida(cantidad);
        String motivo = "Consumo en labor " + labor.getId() + " (" + labor.getTipo() + ")";
        movimientoRepository.guardar(new MovimientoInsumo(null, insumoId, TipoMovimiento.SALIDA, cantidad, motivo, usuarioId));
        return consumoRepository.guardar(new ConsumoLabor(null, laborId, insumoId, cantidad));
    }

    private static void aplicar(Insumo insumo, TipoMovimiento tipo, BigDecimal cantidad) {
        if (tipo == TipoMovimiento.ENTRADA) {
            insumo.registrarEntrada(cantidad);
        } else {
            insumo.registrarSalida(cantidad);
        }
    }

    private Labor obtenerLabor(Long laborId) {
        return laborRepository.buscarPorId(laborId)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la labor con id: " + laborId));
    }

    private void verificarUsuario(Long usuarioId) {
        if (usuarioRepository.buscarPorId(usuarioId).isEmpty()) {
            throw new UsuarioNoEncontradoException(usuarioId);
        }
    }
}
