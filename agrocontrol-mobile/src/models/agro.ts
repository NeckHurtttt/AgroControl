// Contratos tipados: describen la forma de los datos, no los almacenan.
export type Predio = Readonly<{
  id: number;
  nombre: string;
  ubicacion: string;
  areaHa: number;
  activo: boolean;
}>;

export type EstadoParcela = "DISPONIBLE" | "SEMBRADA" | "EN_DESCANSO";

export type Parcela = Readonly<{
  id: number;
  predioId: number; // vínculo 1:N con Predio (todavía no es una foreign key real)
  codigo: string;
  areaHa: number;
  estado: EstadoParcela;
}>;

// Espejo de las entidades Cultivo y Campana del backend.
export type Cultivo = Readonly<{
  id: number;
  nombre: string;
  cicloDias: number | null; // días desde la siembra hasta la cosecha
}>;

export type EstadoCampana = "PLANIFICADA" | "EN_CURSO" | "FINALIZADA";

export type Campana = Readonly<{
  id: number;
  parcelaId: number;
  cultivoId: number;
  fechaInicio: string; // ISO "AAAA-MM-DD": día de siembra
  estado: EstadoCampana;
}>;

export type Seccion = "predios" | "parcelas";
