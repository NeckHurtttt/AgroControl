export interface Incidencia {
  id: number;
  parcelaId: number | null;
  campanaId: number | null;
  laborId: number | null;
  descripcion: string;
  usuarioId: number;
  fecha: string;
}
