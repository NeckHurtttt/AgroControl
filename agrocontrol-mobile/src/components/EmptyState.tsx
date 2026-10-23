import { StyleSheet, Text, View } from "react-native";
import { PALETTE } from "../theme/palette";

type Props = {
  mensaje: string;
};

// "Sin resultados" es un estado válido, no un error.
export function EmptyState({ mensaje }: Props) {
  return (
    <View style={styles.caja}>
      <Text style={styles.texto}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: PALETTE.borde,
    padding: 20,
    alignItems: "center",
  },
  texto: { fontSize: 15, color: PALETTE.textoSuave, textAlign: "center" },
});
