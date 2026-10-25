import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { PALETTE } from "../theme/palette";

type Props = {
  urlInicial: string;
  cargando: boolean;
  error: string | null;
  alEntrar: (url: string, email: string, password: string) => void;
  alVerDemo: () => void;
};

export function LoginPantalla({ urlInicial, cargando, error, alEntrar, alVerDemo }: Props) {
  const [url, setUrl] = useState(urlInicial);
  const [email, setEmail] = useState("jefe@agrocontrol.com");
  const [password, setPassword] = useState("");

  const puedeEntrar = !cargando && url.trim() !== "" && email.trim() !== "" && password !== "";

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>AgroControl</Text>
      <Text style={styles.subtitulo}>Inicie sesión con su usuario del sistema</Text>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Servidor</Text>
        <TextInput
          style={styles.campo}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholder="http://10.0.2.2:8080"
          accessibilityLabel="Dirección del servidor"
        />

        <Text style={styles.etiqueta}>Correo</Text>
        <TextInput
          style={styles.campo}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          accessibilityLabel="Correo"
        />

        <Text style={styles.etiqueta}>Contraseña</Text>
        <TextInput
          style={styles.campo}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={() => puedeEntrar && alEntrar(url, email, password)}
          accessibilityLabel="Contraseña"
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable
          style={[styles.boton, !puedeEntrar && styles.botonApagado]}
          disabled={!puedeEntrar}
          onPress={() => alEntrar(url, email, password)}
          accessibilityRole="button"
        >
          {cargando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botonTexto}>Entrar</Text>}
        </Pressable>
      </View>

      <Pressable onPress={alVerDemo} accessibilityRole="button" style={styles.enlace}>
        <Text style={styles.enlaceTexto}>Ver datos de demostración (sin conexión)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { gap: 16, paddingTop: 40 },
  titulo: { fontSize: 32, fontWeight: "700", color: PALETTE.texto, textAlign: "center" },
  subtitulo: { fontSize: 15, color: PALETTE.textoSuave, textAlign: "center" },
  tarjeta: { backgroundColor: PALETTE.superficie, borderRadius: 12, padding: 16, gap: 6 },
  etiqueta: { fontSize: 14, fontWeight: "600", color: PALETTE.texto, marginTop: 6 },
  campo: {
    borderWidth: 1,
    borderColor: PALETTE.borde,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: PALETTE.texto,
  },
  error: { color: PALETTE.inactivo, backgroundColor: PALETTE.inactivoSuave, padding: 10, borderRadius: 8, marginTop: 8 },
  boton: { backgroundColor: PALETTE.acento, borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 12 },
  botonApagado: { opacity: 0.5 },
  botonTexto: { color: "#fff", fontSize: 16, fontWeight: "700" },
  enlace: { alignItems: "center", padding: 8 },
  enlaceTexto: { color: PALETTE.acento, fontSize: 15, textDecorationLine: "underline" },
});
