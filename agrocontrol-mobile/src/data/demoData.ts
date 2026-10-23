import type { Campana, Cultivo, Parcela, Predio } from "../models/agro";

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

// Mismos cultivos que la semilla de la base de datos.
export const CULTIVOS: readonly Cultivo[] = [
  { id: 1, nombre: "Soya", cicloDias: 120 },
  { id: 2, nombre: "Maíz", cicloDias: 140 },
  { id: 3, nombre: "Sorgo", cicloDias: 110 },
];

// Una campaña = un cultivo sembrado en una parcela desde una fecha.
export const CAMPANAS: readonly Campana[] = [
  { id: 1, parcelaId: 101, cultivoId: 1, fechaInicio: "2026-08-18", estado: "EN_CURSO" },
  { id: 2, parcelaId: 103, cultivoId: 2, fechaInicio: "2026-09-28", estado: "EN_CURSO" },
  { id: 3, parcelaId: 102, cultivoId: 3, fechaInicio: "2026-11-05", estado: "PLANIFICADA" },
];
