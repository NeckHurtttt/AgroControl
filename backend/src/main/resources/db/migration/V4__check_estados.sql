-- V4__check_estados.sql — La base también rechaza estados que no existen.
-- Antes cualquier texto entraba en estado; ahora coincide con los enum del dominio
-- (EstadoCampana, EstadoLabor, EstadoParcela), así un UPDATE manual no puede romper las reglas.

ALTER TABLE agrocontrol.campana
    ADD CONSTRAINT campana_estado_check CHECK (estado IN ('PLANIFICADA', 'EN_CURSO', 'FINALIZADA'));

ALTER TABLE agrocontrol.labor
    ADD CONSTRAINT labor_estado_check CHECK (estado IN ('PLANIFICADA', 'EJECUTADA'));

ALTER TABLE agrocontrol.parcela
    ADD CONSTRAINT parcela_estado_check CHECK (estado IN ('DISPONIBLE', 'EN_PRODUCCION', 'EN_DESCANSO'));
