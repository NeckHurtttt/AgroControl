import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type Seccion = "predios" | "parcelas";

export default function App() {
  const [seccion, setSeccion] = useState<Seccion>("predios");
  const esPredios = seccion === "predios";

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pantalla} edges={["top", "bottom"]}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.contenido}>
          <Text style={styles.titulo}>AgroControl</Text>
          <Text style={styles.subtitulo}>Gestión de predios y parcelas</Text>

          {/* Contadores en cero: todavía no hay API ni datos reales */}
          <View style={styles.fila}>
            <View style={styles.metrica}>
              <Text style={styles.valor}>0</Text>
              <Text style={styles.etiqueta}>Predios</Text>
            </View>
            <View style={styles.metrica}>
              <Text style={styles.valor}>0</Text>
              <Text style={styles.etiqueta}>Parcelas</Text>
            </View>
          </View>

          <View style={styles.fila}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: esPredios }}
              onPress={() => setSeccion("predios")}
              style={[styles.boton, esPredios && styles.botonActivo]}
            >
              <Text style={[styles.textoBoton, esPredios && styles.textoActivo]}>Predios</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: !esPredios }}
              onPress={() => setSeccion("parcelas")}
              style={[styles.boton, !esPredios && styles.botonActivo]}
            >
              <Text style={[styles.textoBoton, !esPredios && styles.textoActivo]}>Parcelas</Text>
            </Pressable>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitulo}>
              {esPredios ? "Módulo Predios" : "Módulo Parcelas"}
            </Text>
            <Text style={styles.panelTexto}>
              {esPredios
                ? "Aquí se listarán los predios (fundos) de la empresa."
                : "Aquí se listarán las parcelas de cada predio."}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: "#F4F7F2" },
  contenido: { padding: 20, gap: 16 },
  titulo: { fontSize: 28, fontWeight: "700", color: "#1F3D2B" },
  subtitulo: { fontSize: 15, color: "#5B6B5F" },
  fila: { flexDirection: "row", gap: 12 },
  metrica: {
    flex: 1,
    minWidth: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  valor: { fontSize: 26, fontWeight: "700", color: "#2E7D32" },
  etiqueta: { fontSize: 14, color: "#5B6B5F" },
  boton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2E7D32",
    alignItems: "center",
  },
  botonActivo: { backgroundColor: "#2E7D32" },
  textoBoton: { fontSize: 16, fontWeight: "600", color: "#2E7D32" },
  textoActivo: { color: "#FFFFFF" },
  panel: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16, gap: 6 },
  panelTitulo: { fontSize: 18, fontWeight: "700", color: "#1F3D2B" },
  panelTexto: { fontSize: 15, color: "#5B6B5F" },
});
