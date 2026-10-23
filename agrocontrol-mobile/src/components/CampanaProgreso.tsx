import { StyleSheet, Text, View } from "react-native";
import type { Campana, Cultivo } from "../models/agro";
import { calcularAvance, formatearFecha } from "../logic/siembra";
import { PALETTE } from "../theme/palette";
import { BarraProgreso } from "./BarraProgreso";

type Props = {
  campana: Campana;
  cultivo: Cultivo;
};

// Qué se sembró, en qué etapa va y cuándo se cosecha.
export function CampanaProgreso({ campana, cultivo }: Props) {
  const a = calcularAvance(campana, cultivo);

  if (campana.estado === "PLANIFICADA") {
    return (
      <View style={[styles.caja, styles.cajaPlan]}>
        <Text style={styles.cultivo}>📅 {cultivo.nombre}</Text>
        <Text style={styles.detalle}>Siembra programada para el {formatearFecha(a.fechaSiembra)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.caja}>
      <View style={styles.cabecera}>
        <Text style={styles.cultivo}>
          {a.etapa.icono} {cultivo.nombre}
        </Text>
        <Text style={styles.etapa}>{a.etapa.nombre}</Text>
      </View>
      <BarraProgreso avance={a.avance} color={PALETTE.sembrada} />
      <Text style={styles.detalle}>
        {a.cicloDias
          ? `Día ${a.dia} de ${a.cicloDias} · ${Math.round(a.avance * 100)}%`
          : `Día ${a.dia} · sin ciclo cargado`}
      </Text>
      <Text style={styles.detalle}>
        Sembrado el {formatearFecha(a.fechaSiembra)}
        {a.fechaCosecha ? ` · cosecha aprox. ${formatearFecha(a.fechaCosecha)}` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: { backgroundColor: PALETTE.sembradaSuave, borderRadius: 10, padding: 10, gap: 6, marginTop: 6 },
  cajaPlan: { backgroundColor: PALETTE.disponibleSuave },
  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cultivo: { fontSize: 15, fontWeight: "700", color: PALETTE.texto },
  etapa: { fontSize: 13, fontWeight: "600", color: PALETTE.sembrada },
  detalle: { fontSize: 13, color: PALETTE.textoSuave },
});
