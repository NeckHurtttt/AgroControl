import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import MisLaboresScreen from '../screens/MisLaboresScreen';
import DetalleLaborScreen from '../screens/DetalleLaborScreen';
import ParcelasScreen from '../screens/ParcelasScreen';
import DetalleParcelaScreen from '../screens/DetalleParcelaScreen';
import { colores } from '../theme';
import type { LaboresStackParams, ParcelasStackParams } from './tipos';

const Tabs = createBottomTabNavigator();
const LaboresStack = createNativeStackNavigator<LaboresStackParams>();
const ParcelasStack = createNativeStackNavigator<ParcelasStackParams>();

const encabezado = {
  headerStyle: { backgroundColor: colores.primario },
  headerTintColor: '#fff',
};

function LaboresNavigator() {
  return (
    <LaboresStack.Navigator screenOptions={encabezado}>
      <LaboresStack.Screen name="MisLabores" component={MisLaboresScreen} options={{ title: 'Mis labores' }} />
      <LaboresStack.Screen name="DetalleLabor" component={DetalleLaborScreen} options={{ title: 'Detalle de labor' }} />
    </LaboresStack.Navigator>
  );
}

function ParcelasNavigator() {
  return (
    <ParcelasStack.Navigator screenOptions={encabezado}>
      <ParcelasStack.Screen name="Parcelas" component={ParcelasScreen} />
      <ParcelasStack.Screen
        name="DetalleParcela"
        component={DetalleParcelaScreen}
        options={({ route }) => ({ title: `Parcela ${route.params.codigo}` })}
      />
    </ParcelasStack.Navigator>
  );
}

const icono = (simbolo: string) => ({ color }: { color: string }) => (
  <Text style={{ color, fontSize: 18 }}>{simbolo}</Text>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tabs.Navigator
        screenOptions={{ headerShown: false, tabBarActiveTintColor: colores.acento }}
      >
        <Tabs.Screen
          name="TabLabores"
          component={LaboresNavigator}
          options={{ title: 'Labores', tabBarIcon: icono('✓') }}
        />
        <Tabs.Screen
          name="TabParcelas"
          component={ParcelasNavigator}
          options={{ title: 'Parcelas', tabBarIcon: icono('▦') }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
