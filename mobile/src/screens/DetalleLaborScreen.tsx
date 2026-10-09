import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { agroApi, hoyIso } from '../api/agroApi';
import type { Consumo, Insumo, Labor, Usuario } from '../api/tipos';
import { Boton, Cargando, EstadoChip, MensajeError, estilosComunes } from '../components/Comunes';
import type { LaboresStackParams } from '../navigation/tipos';
import { colores } from '../theme';

type Props = NativeStackScreenProps<LaboresStackParams, 'DetalleLabor'>;

export default function DetalleLaborScreen({ route }: Props) {
  const { laborId } = route.params;
  const [labor, setLabor] = useState<Labor | null>(null);
  const [consumos, setConsumos] = useState<Consumo[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const [insumoId, setInsumoId] = useState<number | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState('');

  const cargar = useCallback(async () => {
    try {
      setError(null);
      const [l, c, i, u] = await Promise.all([
        agroApi.obtenerLabor(laborId),
        agroApi.listarConsumos(laborId),
        agroApi.listarInsumos(),
        agroApi.listarUsuarios(),
      ]);
      setLabor(l);
      setConsumos(c);
      setInsumos(i);
      setUsuarios(u.filter((x) => x.estado === 'ACTIVO'));
    } catch (e) {
      setError((e as Error).message);
    }
  }, [laborId]);

  useEffect(() => { cargar(); }, [cargar]);

  const ejecutar = async () => {
    setEnviando(true);
    setAviso(null);
    try {
      setLabor(await agroApi.ejecutarLabor(laborId, hoyIso()));
      setError(null);
      setAviso('Labor marcada como ejecutada.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  const registrarConsumo = async () => {
    const valor = Number(cantidad.replace(',', '.'));
    if (!insumoId || !usuarioId) return setError('Elegí el insumo y quién registra el consumo.');
    if (!(valor > 0)) return setError('La cantidad debe ser mayor que cero.');
    setEnviando(true);
    setAviso(null);
    try {
      await agroApi.registrarConsumo(laborId, insumoId, valor, usuarioId);
      setCantidad('');
      await cargar();
      setAviso('Consumo registrado: el stock se descontó en el almacén.');
    } catch (e) {
      // Por ejemplo 409 si la cantidad supera el stock disponible (RN-04).
      setError((e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  if (!labor) return error ? <MensajeError mensaje={error} onReintentar={cargar} /> : <Cargando />;

  const nombreInsumo = (id: number) => insumos.find((i) => i.id === id);
  const insumoElegido = insumoId ? nombreInsumo(insumoId) : undefined;

  return (
    <ScrollView style={estilosComunes.pantalla} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={estilosComunes.tarjeta}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={[estilosComunes.titulo, { fontSize: 20 }]}>{labor.tipo}</Text>
          <EstadoChip estado={labor.estado} />
        </View>
        <Text style={estilosComunes.subtitulo}>Campaña #{labor.campanaId} · Parcela #{labor.parcelaId}</Text>
        <Text style={estilosComunes.subtitulo}>Fecha planificada: {labor.fechaPlan}</Text>
        {labor.fechaEjecucion && (
          <Text style={estilosComunes.subtitulo}>Fecha de ejecución: {labor.fechaEjecucion}</Text>
        )}
        {labor.estado !== 'EJECUTADA' && (
          <Boton titulo="Marcar como ejecutada (hoy)" onPress={ejecutar} deshabilitado={enviando} />
        )}
      </View>

      {error && <MensajeError mensaje={error} />}
      {aviso && <Text style={styles.aviso}>{aviso}</Text>}

      <View style={estilosComunes.tarjeta}>
        <Text style={estilosComunes.seccion}>Insumos consumidos</Text>
        {consumos.length === 0 && <Text style={estilosComunes.subtitulo}>Sin consumos registrados.</Text>}
        {consumos.map((c) => {
          const ins = nombreInsumo(c.insumoId);
          return (
            <Text key={c.id} style={styles.fila}>
              {ins?.nombre ?? `Insumo #${c.insumoId}`}: {c.cantidad} {ins?.unidadMedida ?? ''}
            </Text>
          );
        })}
      </View>

      <View style={estilosComunes.tarjeta}>
        <Text style={estilosComunes.seccion}>Registrar consumo</Text>
        <Text style={styles.etiqueta}>Insumo</Text>
        <View style={styles.opciones}>
          {insumos.map((i) => (
            <Opcion key={i.id} activa={insumoId === i.id} onPress={() => setInsumoId(i.id)}
              texto={`${i.nombre} (${i.stockActual} ${i.unidadMedida})`} />
          ))}
        </View>
        <Text style={styles.etiqueta}>
          Cantidad{insumoElegido ? ` en ${insumoElegido.unidadMedida}` : ''}
        </Text>
        <TextInput
          style={styles.input}
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
        <Text style={styles.etiqueta}>Registrado por</Text>
        <View style={styles.opciones}>
          {usuarios.map((u) => (
            <Opcion key={u.id} activa={usuarioId === u.id} onPress={() => setUsuarioId(u.id)} texto={u.nombreCompleto} />
          ))}
        </View>
        <Boton titulo="Registrar consumo" onPress={registrarConsumo} deshabilitado={enviando} />
      </View>
    </ScrollView>
  );
}

function Opcion({ texto, activa, onPress }: { texto: string; activa: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.opcion, activa && styles.opcionActiva]}>
      <Text style={{ color: activa ? '#fff' : colores.texto, fontSize: 13 }}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  aviso: { marginHorizontal: 16, marginTop: 12, color: colores.acento, fontWeight: '600' },
  fila: { color: colores.texto, paddingVertical: 3 },
  etiqueta: { color: colores.textoSuave, fontSize: 13, marginTop: 10, marginBottom: 6 },
  opciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  opcion: { borderWidth: 1, borderColor: colores.borde, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  opcionActiva: { backgroundColor: colores.acento, borderColor: colores.acento },
  input: {
    borderWidth: 1, borderColor: colores.borde, borderRadius: 8, padding: 10,
    backgroundColor: '#fff', color: colores.texto,
  },
});
