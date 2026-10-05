import { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { agroApi } from '../api/agroApi';
import type { Labor } from '../api/tipos';
import { Cargando, EstadoChip, MensajeError, estilosComunes } from '../components/Comunes';
import type { LaboresStackParams } from '../navigation/tipos';

type Props = NativeStackScreenProps<LaboresStackParams, 'MisLabores'>;

export default function MisLaboresScreen({ navigation }: Props) {
  const [labores, setLabores] = useState<Labor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refrescando, setRefrescando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      setError(null);
      const datos = await agroApi.listarLabores();
      // Primero lo pendiente, luego por fecha planificada.
      datos.sort((a, b) =>
        Number(a.estado === 'EJECUTADA') - Number(b.estado === 'EJECUTADA') ||
        a.fechaPlan.localeCompare(b.fechaPlan));
      setLabores(datos);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  // Recarga al volver del detalle para reflejar el nuevo estado.
  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  const refrescar = async () => {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  };

  if (error && !labores) return <MensajeError mensaje={error} onReintentar={cargar} />;
  if (!labores) return <Cargando />;

  return (
    <View style={estilosComunes.pantalla}>
      {error && <MensajeError mensaje={error} />}
      <FlatList
        data={labores}
        keyExtractor={(l) => String(l.id)}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={refrescar} />}
        ListEmptyComponent={<Text style={estilosComunes.vacio}>No hay labores registradas.</Text>}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <Pressable
            style={estilosComunes.tarjeta}
            onPress={() => navigation.navigate('DetalleLabor', { laborId: item.id })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={estilosComunes.titulo}>{item.tipo}</Text>
              <EstadoChip estado={item.estado} />
            </View>
            <Text style={estilosComunes.subtitulo}>
              Campaña #{item.campanaId} · Parcela #{item.parcelaId}
            </Text>
            <Text style={estilosComunes.subtitulo}>
              Plan: {item.fechaPlan}
              {item.fechaEjecucion ? `  ·  Ejecutada: ${item.fechaEjecucion}` : ''}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
