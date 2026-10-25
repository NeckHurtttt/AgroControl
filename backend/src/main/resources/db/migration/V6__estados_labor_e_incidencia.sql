-- V6__estados_labor_e_incidencia.sql
-- 1. La labor tiene un paso intermedio: PLANIFICADA → EN_CURSO → EJECUTADA (RN-03).
-- 2. La incidencia tiene ciclo de vida: ABIERTA → EN_ATENCION → RESUELTA, con lo que se hizo y cuándo.

ALTER TABLE agrocontrol.labor DROP CONSTRAINT labor_estado_check;
ALTER TABLE agrocontrol.labor
    ADD CONSTRAINT labor_estado_check CHECK (estado IN ('PLANIFICADA', 'EN_CURSO', 'EJECUTADA'));

ALTER TABLE agrocontrol.incidencia
    ADD COLUMN estado varchar(20) NOT NULL DEFAULT 'ABIERTA',
    ADD COLUMN resolucion text,
    ADD COLUMN resuelta_en timestamp without time zone,
    ADD CONSTRAINT incidencia_estado_check CHECK (estado IN ('ABIERTA', 'EN_ATENCION', 'RESUELTA')),
    -- Una incidencia resuelta siempre dice cómo y cuándo
    ADD CONSTRAINT incidencia_resuelta_check CHECK (
        estado <> 'RESUELTA' OR (resolucion IS NOT NULL AND resuelta_en IS NOT NULL));

CREATE INDEX idx_incidencia_estado ON agrocontrol.incidencia (estado);
