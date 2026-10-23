import { StyleSheet, View } from "react-native";
import { PALETTE } from "../theme/palette";

type Props = {
  avance: number; // 0..1
  color: string;
};

export function BarraProgreso({ avance, color }: Props) {
  const porcentaje = Math.round(Math.min(1, Math.max(0, avance)) * 100);
  return (
    <View
      style={styles.pista}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: porcentaje }}
    >
      <View style={[styles.relleno, { width: `${porcentaje}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  pista: { height: 10, borderRadius: 5, backgroundColor: PALETTE.pista, overflow: "hidden" },
  relleno: { height: "100%", borderRadius: 5 },
});
