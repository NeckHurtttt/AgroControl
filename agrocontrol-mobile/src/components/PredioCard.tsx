import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Predio } from "../models/agro";
import { PALETTE } from "../theme/palette";

type Props = {
  predio: Predio;
  cantidadParcelas: number;
  seleccionado: boolean;
  alSeleccionar: (id: number) => void;
};

// El hijo avisa con alSeleccionar; App decide y guarda la selección.
export function PredioCard({ predio, cantidadParcelas, seleccionado, alSeleccionar }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver parcelas de ${predio.nombre}`}
      accessibilityState={{ selected: seleccionado }}
      onPress={() => alSeleccionar(predio.id)}
      style={[styles.tarjeta, seleccionado && styles.seleccionada]}
    >
      <View style={styles.cabecera}>
        <Text style={styles.nombre}>{predio.nombre}</Text>
        <Text style={[styles.estado, !predio.activo && styles.estadoInactivo]}>
          {predio.activo ? "ACTIVO" : "INACTIVO"}
        </Text>
      </View>
      <Text style={styles.detalle}>
        {predio.ubicacion} · {predio.areaHa} ha · {cantidadParcelas} parcela(s)
      </Text>
      {seleccionado && <Text style={styles.marca}>Seleccionado</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: PALETTE.superficie,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: PALETTE.borde,
    padding: 14,
    gap: 4,
  },
  seleccionada: { borderColor: PALETTE.acento, backgroundColor: PALETTE.acentoSuave },
  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nombre: { fontSize: 16, fontWeight: "700", color: PALETTE.texto, flexShrink: 1 },
  estado: {
    fontSize: 12,
    fontWeight: "700",
    color: PALETTE.acento,
    backgroundColor: PALETTE.acentoSuave,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  estadoInactivo: { color: PALETTE.inactivo, backgroundColor: PALETTE.inactivoSuave },
  detalle: { fontSize: 14, color: PALETTE.textoSuave },
  marca: { fontSize: 13, fontWeight: "600", color: PALETTE.acento },
});
