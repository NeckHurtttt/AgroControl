import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import type { Seccion } from "./src/models/agro";
import { CAMPANAS, CULTIVOS, PARCELAS, PREDIOS } from "./src/data/demoData";
import { PALETTE } from "./src/theme/palette";
import { MetricCard } from "./src/components/MetricCard";
import { TabSelector } from "./src/components/TabSelector";
import { PredioCard } from "./src/components/PredioCard";
import { ParcelaCard } from "./src/components/ParcelaCard";
import { EmptyState } from "./src/components/EmptyState";
import { ResumenCampo } from "./src/components/ResumenCampo";

export default function App() {
  // Único estado: qué sección se ve y qué predio está elegido.
  const [seccion, setSeccion] = useState<Seccion>("predios");
  const [predioId, setPredioId] = useState<number | null>(null);

  // Estado derivado: se recalcula en cada render, no se guarda.
  const predioElegido = PREDIOS.find((p) => p.id === predioId) ?? null;
  const parcelasElegidas = predioElegido
    ? PARCELAS.filter((p) => p.predioId === predioElegido.id)
    : [];

  const contarParcelas = (id: number) => PARCELAS.filter((p) => p.predioId === id).length;
  const nombreDePredio = (id: number) =>
    PREDIOS.find((p) => p.id === id)?.nombre ?? "Predio desconocido";
  const sembradas = PARCELAS.filter((p) => p.estado === "SEMBRADA").length;

  // Campaña no finalizada de la parcela, con su cultivo (si existe).
  const siembraDe = (parcelaId: number) => {
    const campana = CAMPANAS.find((c) => c.parcelaId === parcelaId && c.estado !== "FINALIZADA");
    const cultivo = campana && CULTIVOS.find((c) => c.id === campana.cultivoId);
    return { campana, cultivo };
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pantalla} edges={["top", "bottom"]}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.contenido}>
          <Text style={styles.titulo}>AgroControl</Text>
          <Text style={styles.subtitulo}>Gestión de predios, parcelas y siembras</Text>

          <View style={styles.fila}>
            <MetricCard etiqueta="Predios" valor={PREDIOS.length} />
            <MetricCard etiqueta="Parcelas" valor={PARCELAS.length} />
            <MetricCard etiqueta="Sembradas" valor={sembradas} />
          </View>

          <ResumenCampo parcelas={PARCELAS} />

          <TabSelector seccion={seccion} alCambiar={setSeccion} />

          {seccion === "predios" ? (
            <View style={styles.lista}>
              <Text style={styles.seccionTitulo}>Predios</Text>
              {PREDIOS.map((predio) => (
                <PredioCard
                  key={predio.id}
                  predio={predio}
                  cantidadParcelas={contarParcelas(predio.id)}
                  seleccionado={predioId === predio.id}
                  alSeleccionar={setPredioId}
                />
              ))}

              <Text style={styles.seccionTitulo}>
                {predioElegido ? `Parcelas de ${predioElegido.nombre}` : "Parcelas del predio"}
              </Text>
              {!predioElegido ? (
                <EmptyState mensaje="Toque un predio para ver sus parcelas." />
              ) : parcelasElegidas.length === 0 ? (
                <EmptyState mensaje="Este predio no tiene parcelas." />
              ) : (
                parcelasElegidas.map((parcela) => (
                  <ParcelaCard
                    key={parcela.id}
                    parcela={parcela}
                    nombrePredio={predioElegido.nombre}
                    {...siembraDe(parcela.id)}
                  />
                ))
              )}
            </View>
          ) : (
            <View style={styles.lista}>
              <Text style={styles.seccionTitulo}>Todas las parcelas</Text>
              {PARCELAS.map((parcela) => (
                <ParcelaCard
                  key={parcela.id}
                  parcela={parcela}
                  nombrePredio={nombreDePredio(parcela.predioId)}
                  {...siembraDe(parcela.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: PALETTE.fondo },
  contenido: { padding: 20, gap: 16 },
  titulo: { fontSize: 28, fontWeight: "700", color: PALETTE.texto },
  subtitulo: { fontSize: 15, color: PALETTE.textoSuave },
  fila: { flexDirection: "row", gap: 12 },
  lista: { gap: 10 },
  seccionTitulo: { fontSize: 18, fontWeight: "700", color: PALETTE.texto, marginTop: 4 },
});
