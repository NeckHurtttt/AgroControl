import { StyleSheet, Text, View } from "react-native";
import { PALETTE } from "../theme/palette";

type Props = {
  etiqueta: string;
  valor: number;
};

export function MetricCard({ etiqueta, valor }: Props) {
  return (
    <View style={styles.tarjeta} accessible accessibilityLabel={`${etiqueta}: ${valor}`}>
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    minWidth: 90,
    backgroundColor: PALETTE.superficie,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  valor: { fontSize: 26, fontWeight: "700", color: PALETTE.acento },
  etiqueta: { fontSize: 14, color: PALETTE.textoSuave },
});
