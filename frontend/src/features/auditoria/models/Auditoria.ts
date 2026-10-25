// Respuesta de GET /api/auditoria (RF-16)
export interface RegistroAuditoria {
  id: number;
  usuarioId: number | null;
  entidad: string;
  idEntidad: number;
  accion: string;
  detalle: string | null;
  fecha: string;
}
