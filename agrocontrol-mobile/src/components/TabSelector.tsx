import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Seccion } from "../models/agro";
import { PALETTE } from "../theme/palette";

type Props = {
  seccion: Seccion;
  alCambiar: (seccion: Seccion) => void;
};

const OPCIONES: { valor: Seccion; texto: string }[] = [
  { valor: "predios", texto: "Predios" },
  { valor: "parcelas", texto: "Parcelas" },
];

export function TabSelector({ seccion, alCambiar }: Props) {
  return (
    <View style={styles.fila}>
      {OPCIONES.map((opcion) => {
        const activo = seccion === opcion.valor;
        return (
          <Pressable
            key={opcion.valor}
            accessibilityRole="button"
            accessibilityState={{ selected: activo }}
            onPress={() => alCambiar(opcion.valor)}
            style={[styles.boton, activo && styles.botonActivo]}
          >
            <Text style={[styles.texto, activo && styles.textoActivo]}>{opcion.texto}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: "row", gap: 12 },
  boton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PALETTE.acento,
    alignItems: "center",
  },
  botonActivo: { backgroundColor: PALETTE.acento },
  texto: { fontSize: 16, fontWeight: "600", color: PALETTE.acento },
  textoActivo: { color: PALETTE.superficie },
});
