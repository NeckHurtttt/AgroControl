package com.agrocontrol.bitacora.domain;

import java.util.List;

public interface BitacoraRepository {
    BitacoraCampo guardar(BitacoraCampo entrada);
    List<BitacoraCampo> listarPorLabor(Long laborId);
    // Todas las observaciones de las labores de la parcela, de la más reciente a la más antigua
    List<BitacoraCampo> listarPorParcela(Long parcelaId);
}
