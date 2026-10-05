import { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { agroApi } from '../api/agroApi';
import type { Campana, Labor } from '../api/tipos';
import { Cargando, EstadoChip, MensajeError, estilosComunes } from '../components/Comunes';
import type { ParcelasStackParams } from '../navigation/tipos';

type Props = NativeStackScreenProps<ParcelasStackParams, 'DetalleParcela'>;

// Detalle de parcela/campaña: campañas de la parcela y sus labores.
export default function DetalleParcelaScreen({ route }: Props) {
  const { parcelaId } = route.params;
  const [campanas, setCampanas] = useState<Campana[] | null>(null);
  const [labores, setLabores] = useState<Labor[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setError(null);
      const [c, l] = await Promise.all([agroApi.listarCampanas(parcelaId), agroApi.listarLabores()]);
      setCampanas(c);
      setLabores(l.filter((x) => x.parcelaId === parcelaId));
    } catch (e) {
      setError((e as Error).message);
    }
  }, [parcelaId]);

  useEffect(() => { cargar(); }, [cargar]);

  if (error) return <MensajeError mensaje={error} onReintentar={cargar} />;
  if (!campanas) return <Cargando />;

  return (
    <ScrollView style={estilosComunes.pantalla} contentContainerStyle={{ paddingBottom: 24 }}>
      {campanas.length === 0 && <Text style={estilosComunes.vacio}>Esta parcela no tiene campañas.</Text>}
      {campanas.map((c) => (
        <View key={c.id} style={estilosComunes.tarjeta}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={estilosComunes.titulo}>Campaña #{c.id}</Text>
            <EstadoChip estado={c.estado} />
          </View>
          <Text style={estilosComunes.subtitulo}>
            {c.fechaInicio} → {c.fechaFin ?? 'en curso'}
          </Text>
          {labores.filter((l) => l.campanaId === c.id).map((l) => (
            <Text key={l.id} style={[estilosComunes.subtitulo, { marginTop: 6 }]}>
              • {l.tipo} — {l.estado} ({l.fechaPlan})
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
