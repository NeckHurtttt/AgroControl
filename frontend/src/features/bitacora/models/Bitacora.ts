// Respuesta de /api/labores/{id}/bitacora y /api/parcelas/{id}/bitacora
export interface EntradaBitacora {
  id: number;
  laborId: number;
  usuarioId: number;
  observacion: string;
  fecha: string;
}
