import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colores, coloresEstado } from '../theme';

export function EstadoChip({ estado }: { estado: string }) {
  const color = coloresEstado[estado] ?? colores.textoSuave;
  return (
    <View style={[styles.chip, { borderColor: color }]}>
      <Text style={[styles.chipTexto, { color }]}>{estado.replace('_', ' ')}</Text>
    </View>
  );
}

export function Cargando() {
  return (
    <View style={styles.centro}>
      <ActivityIndicator color={colores.acento} size="large" />
    </View>
  );
}

export function MensajeError({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <View style={styles.error}>
      <Text style={styles.errorTexto}>{mensaje}</Text>
      {onReintentar && (
        <Pressable onPress={onReintentar}>
          <Text style={styles.reintentar}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}

export function Boton({ titulo, onPress, deshabilitado }: { titulo: string; onPress: () => void; deshabilitado?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={deshabilitado}
      style={({ pressed }) => [styles.boton, (pressed || deshabilitado) && { opacity: 0.6 }]}
    >
      <Text style={styles.botonTexto}>{titulo}</Text>
    </Pressable>
  );
}

export const estilosComunes = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  tarjeta: {
    backgroundColor: colores.tarjeta,
    borderColor: colores.borde,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: colores.texto },
  subtitulo: { fontSize: 13, color: colores.textoSuave, marginTop: 4 },
  seccion: { fontSize: 13, fontWeight: '700', color: colores.textoSuave, marginBottom: 8, textTransform: 'uppercase' },
  vacio: { textAlign: 'center', color: colores.textoSuave, marginTop: 32 },
});

const styles = StyleSheet.create({
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 2, alignSelf: 'flex-start' },
  chipTexto: { fontSize: 12, fontWeight: '600' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { backgroundColor: colores.errorFondo, borderRadius: 10, padding: 12, margin: 16 },
  errorTexto: { color: colores.error },
  reintentar: { color: colores.error, fontWeight: '700', marginTop: 8 },
  boton: { backgroundColor: colores.acento, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  botonTexto: { color: '#fff', fontWeight: '700' },
});
