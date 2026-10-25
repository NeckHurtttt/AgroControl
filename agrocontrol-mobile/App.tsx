import { useEffect, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import type { Parcela, Seccion } from "./src/models/agro";
import { CAMPANAS, COSECHAS, CULTIVOS, INCIDENCIAS, LABORES, PARCELAS, PREDIOS } from "./src/data/demoData";
import { armarDetalle } from "./src/logic/detalleParcela";
import { PALETTE } from "./src/theme/palette";
import { MetricCard } from "./src/components/MetricCard";
import { TabSelector } from "./src/components/TabSelector";
import { PredioCard } from "./src/components/PredioCard";
import { ParcelaCard } from "./src/components/ParcelaCard";
import { EmptyState } from "./src/components/EmptyState";
import { ResumenCampo } from "./src/components/ResumenCampo";
import { PredioDetalle } from "./src/components/PredioDetalle";

export default function App() {
  // Único estado: qué sección se ve y qué predio está elegido.
  const [seccion, setSeccion] = useState<Seccion>("predios");
  const [predioId, setPredioId] = useState<number | null>(null);

  // Estado derivado: se recalcula en cada render, no se guarda.
  const predioElegido = PREDIOS.find((p) => p.id === predioId) ?? null;
  const parcelasElegidas = predioElegido
    ? PARCELAS.filter((p) => p.predioId === predioElegido.id)
    : [];

  // Con un predio abierto, el botón "atrás" de Android vuelve a la lista en vez de cerrar la app.
  useEffect(() => {
    if (predioId === null) return;
    const suscripcion = BackHandler.addEventListener("hardwareBackPress", () => {
      setPredioId(null);
      return true;
    });
    return () => suscripcion.remove();
  }, [predioId]);

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

  const detalleDe = (parcela: Parcela) =>
    armarDetalle(parcela, {
      campanas: CAMPANAS,
      cultivos: CULTIVOS,
      labores: LABORES,
      cosechas: COSECHAS,
      incidencias: INCIDENCIAS,
    });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pantalla} edges={["top", "bottom"]}>
        <StatusBar style="dark" />
        {/* key: al abrir o cerrar un predio el scroll vuelve arriba */}
        <ScrollView key={predioId ?? "inicio"} contentContainerStyle={styles.contenido}>
          {predioElegido ? (
            <PredioDetalle
              predio={predioElegido}
              parcelas={parcelasElegidas}
              detalleDe={detalleDe}
              alVolver={() => setPredioId(null)}
            />
          ) : (
            <>
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

                <Text style={styles.ayuda}>Toque un predio para ver sus parcelas y el estado de cada una.</Text>
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
            </>
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
  ayuda: { fontSize: 14, color: PALETTE.textoSuave, textAlign: "center" },
});
