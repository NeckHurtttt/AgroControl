// Espejo de los DTO de respuesta del backend (records *Response).
export interface Labor {
  id: number;
  campanaId: number;
  parcelaId: number;
  tipo: string;
  fechaPlan: string;
  fechaEjecucion: string | null;
  estado: string;
}

export interface Consumo {
  id: number;
  laborId: number;
  insumoId: number;
  cantidad: number;
  fecha: string;
}

export interface Insumo {
  id: number;
  nombre: string;
  unidadMedida: string;
  stockActual: number;
}

export interface Usuario {
  id: number;
  nombreCompleto: string;
  email: string;
  rolId: number;
  estado: string;
}

export interface Parcela {
  id: number;
  predioId: number;
  codigo: string;
  areaHa: number | null;
  estado: string;
}

export interface Campana {
  id: number;
  parcelaId: number;
  cultivoId: number;
  fechaInicio: string;
  fechaFin: string | null;
  estado: string;
}
