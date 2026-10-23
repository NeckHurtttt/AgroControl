import type { Parcela, Predio } from "../models/agro";

// Registros ficticios para practicar; no vienen del backend.
export const PREDIOS: readonly Predio[] = [
  { id: 1, nombre: "Fundo San José", ubicacion: "Warnes", areaHa: 75, activo: true },
  { id: 2, nombre: "Fundo Las Palmeras", ubicacion: "Montero", areaHa: 50, activo: true },
  { id: 3, nombre: "Predio El Retiro", ubicacion: "Cotoca", areaHa: 40, activo: false },
  { id: 4, nombre: "Predio Nuevo Horizonte", ubicacion: "Pailón", areaHa: 20, activo: true },
];

// San José: 2 parcelas · Las Palmeras: 1 · El Retiro (inactivo): 2 · Nuevo Horizonte: 0
export const PARCELAS: readonly Parcela[] = [
  { id: 101, predioId: 1, codigo: "P-01", areaHa: 45, estado: "SEMBRADA" },
  { id: 102, predioId: 1, codigo: "P-02", areaHa: 30, estado: "DISPONIBLE" },
  { id: 103, predioId: 2, codigo: "P-01", areaHa: 50, estado: "SEMBRADA" },
  { id: 104, predioId: 3, codigo: "P-01", areaHa: 25, estado: "EN_DESCANSO" },
  { id: 105, predioId: 3, codigo: "P-02", areaHa: 15, estado: "EN_DESCANSO" },
];
