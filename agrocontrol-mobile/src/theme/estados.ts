import type { EstadoParcela } from "../models/agro";
import { PALETTE } from "./palette";

// Cómo se ve cada estado de parcela: un solo lugar para chip, barra y leyenda.
export const ESTADO_VISUAL: Record<
  EstadoParcela,
  Readonly<{ texto: string; icono: string; color: string; fondo: string }>
> = {
  SEMBRADA: { texto: "Sembrada", icono: "🌱", color: PALETTE.sembrada, fondo: PALETTE.sembradaSuave },
  DISPONIBLE: { texto: "Lista para sembrar", icono: "🟫", color: PALETTE.disponible, fondo: PALETTE.disponibleSuave },
  EN_DESCANSO: { texto: "En descanso", icono: "💤", color: PALETTE.descanso, fondo: PALETTE.descansoSuave },
};
