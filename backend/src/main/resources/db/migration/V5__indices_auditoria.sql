-- V5__indices_auditoria.sql — La auditoría se escribe en cada cambio crítico (RF-16) y crece rápido.
-- Se consulta filtrando por entidad/id y siempre de lo más reciente a lo más antiguo.

CREATE INDEX idx_auditoria_entidad ON agrocontrol.auditoria (entidad, id_entidad);
CREATE INDEX idx_auditoria_fecha ON agrocontrol.auditoria (fecha DESC);
