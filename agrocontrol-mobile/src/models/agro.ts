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

export type Seccion = "predios" | "parcelas";
