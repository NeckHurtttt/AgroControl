import { StyleSheet, Text, View } from "react-native";
import type { Parcela } from "../models/agro";
import { PALETTE } from "../theme/palette";

type Props = {
  parcela: Parcela;
  nombrePredio: string;
};

export function ParcelaCard({ parcela, nombrePredio }: Props) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.codigo}>
        {parcela.codigo} <Text style={styles.id}>#{parcela.id}</Text>
      </Text>
      <Text style={styles.detalle}>
        {parcela.areaHa} ha · {parcela.estado.replace("_", " ")}
      </Text>
      <Text style={styles.predio}>Predio: {nombrePredio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: PALETTE.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.borde,
    padding: 14,
    gap: 2,
  },
  codigo: { fontSize: 16, fontWeight: "700", color: PALETTE.texto },
  id: { fontSize: 13, fontWeight: "400", color: PALETTE.textoSuave },
  detalle: { fontSize: 14, color: PALETTE.textoSuave },
  predio: { fontSize: 13, color: PALETTE.acento },
});
