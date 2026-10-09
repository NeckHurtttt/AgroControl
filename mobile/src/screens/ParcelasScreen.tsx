import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { agroApi } from '../api/agroApi';
import type { Parcela } from '../api/tipos';
import { Cargando, EstadoChip, MensajeError, estilosComunes } from '../components/Comunes';
import type { ParcelasStackParams } from '../navigation/tipos';

type Props = NativeStackScreenProps<ParcelasStackParams, 'Parcelas'>;

export default function ParcelasScreen({ navigation }: Props) {
  const [parcelas, setParcelas] = useState<Parcela[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    try {
      setError(null);
      setParcelas(await agroApi.listarParcelas());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  if (error) return <MensajeError mensaje={error} onReintentar={cargar} />;
  if (!parcelas) return <Cargando />;

  return (
    <View style={estilosComunes.pantalla}>
      <FlatList
        data={parcelas}
        keyExtractor={(p) => String(p.id)}
        ListEmptyComponent={<Text style={estilosComunes.vacio}>No hay parcelas registradas.</Text>}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <Pressable
            style={estilosComunes.tarjeta}
            onPress={() => navigation.navigate('DetalleParcela', { parcelaId: item.id, codigo: item.codigo })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={estilosComunes.titulo}>{item.codigo}</Text>
              <EstadoChip estado={item.estado} />
            </View>
            <Text style={estilosComunes.subtitulo}>
              Predio #{item.predioId} · {item.areaHa != null ? `${item.areaHa} ha` : 'Área sin registrar'}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
