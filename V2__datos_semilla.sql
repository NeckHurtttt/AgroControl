-- =====================================================================
-- AgroControl · V2 · Datos semilla mínimos
-- Ejecutar DESPUÉS de V1, conectado como agrocontrol_admin / agrocontrol
-- Los password_hash son de EJEMPLO (no son contraseñas reales).
-- Deja armado el flujo crítico hasta la asignación de labores.
-- =====================================================================
SET search_path TO agrocontrol, public;

BEGIN;

-- Roles (actores de la ficha, sección C)
INSERT INTO rol (codigo, nombre, descripcion) VALUES
 ('ADMINISTRADOR', 'Administrador', 'Configura predios, usuarios y catálogos'),
 ('JEFE_CAMPO',    'Jefe de campo', 'Planifica campañas y labores'),
 ('OPERARIO',      'Operario',      'Consulta y reporta labores desde móvil'),
 ('ALMACENERO',    'Almacenero',    'Registra salidas de insumos para labores'),
 ('SUPERVISOR',    'Supervisor',    'Consulta avance e indicadores');

-- Usuarios
INSERT INTO usuario (username, email, password_hash, nombre_completo) VALUES
 ('admin',      'admin@agrocontrol.bo',      '$2a$10$HASH.DE.EJEMPLO.admin',      'Administrador General'),
 ('jefe.campo', 'jefe.campo@agrocontrol.bo', '$2a$10$HASH.DE.EJEMPLO.jefe',       'Elena Suárez'),
 ('operario1',  'operario1@agrocontrol.bo',  '$2a$10$HASH.DE.EJEMPLO.operario',   'Mario Chávez'),
 ('almacen1',   'almacen1@agrocontrol.bo',   '$2a$10$HASH.DE.EJEMPLO.almacen',    'Rosa Aguilar'),
 ('supervisor', 'supervisor@agrocontrol.bo', '$2a$10$HASH.DE.EJEMPLO.supervisor', 'Iván Peredo');

INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.usuario_id, r.rol_id
FROM usuario u
JOIN rol r ON (u.username, r.codigo) IN (
    ('admin','ADMINISTRADOR'), ('jefe.campo','JEFE_CAMPO'), ('operario1','OPERARIO'),
    ('almacen1','ALMACENERO'), ('supervisor','SUPERVISOR'));

-- Unidades de medida (RN-07)
INSERT INTO unidad_medida (codigo, nombre, magnitud) VALUES
 ('KG',  'Kilogramo',      'MASA'),
 ('TN',  'Tonelada',       'MASA'),
 ('L',   'Litro',          'VOLUMEN'),
 ('HA',  'Hectárea',       'SUPERFICIE'),
 ('UN',  'Unidad',         'CONTEO'),
 ('BOL', 'Bolsa de 50 kg', 'MASA'),
 ('HR',  'Hora',           'TIEMPO');

-- Predios (entidad padre)
INSERT INTO predio (codigo, nombre, municipio, ubicacion, responsable_id) VALUES
 ('PRD-NORTE', 'Predio San Julián', 'San Julián',  'Km 42 carretera al norte',
  (SELECT usuario_id FROM usuario WHERE username='jefe.campo')),
 ('PRD-SUR',   'Predio Cuatro Cañadas', 'Cuatro Cañadas', 'Zona sur, camino vecinal 3',
  (SELECT usuario_id FROM usuario WHERE username='jefe.campo'));

-- Parcelas (entidad dependiente) · código único DENTRO del predio
INSERT INTO parcela (predio_id, codigo, nombre, superficie_hectareas, tipo_suelo, estado) VALUES
 ((SELECT predio_id FROM predio WHERE codigo='PRD-NORTE'), 'P-01', 'Lote 1 Norte',  25.5000, 'FRANCO',        'DISPONIBLE'),
 ((SELECT predio_id FROM predio WHERE codigo='PRD-NORTE'), 'P-02', 'Lote 2 Norte',  18.7500, 'FRANCO_ARENOSO','DISPONIBLE'),
 ((SELECT predio_id FROM predio WHERE codigo='PRD-NORTE'), 'P-03', 'Lote 3 Norte',  30.0000, 'ARCILLOSO',     'EN_DESCANSO'),
 -- mismo código P-01, otro predio: la unicidad es contextual
 ((SELECT predio_id FROM predio WHERE codigo='PRD-SUR'),   'P-01', 'Lote 1 Sur',    40.2500, 'FRANCO',        'DISPONIBLE'),
 ((SELECT predio_id FROM predio WHERE codigo='PRD-SUR'),   'P-02', 'Lote 2 Sur',    22.0000, 'ARCILLOSO',     'DISPONIBLE');

-- Cultivos
INSERT INTO cultivo (codigo, nombre, variedad, ciclo_dias, unidad_cosecha_id) VALUES
 ('CUL-SOJ', 'Soya',  'INTA 1000', 120, (SELECT unidad_id FROM unidad_medida WHERE codigo='TN')),
 ('CUL-MAI', 'Maíz',  'DK 390',    140, (SELECT unidad_id FROM unidad_medida WHERE codigo='TN')),
 ('CUL-GIR', 'Girasol','Paraíso 33',110, (SELECT unidad_id FROM unidad_medida WHERE codigo='KG'));

-- Insumos
INSERT INTO insumo (codigo, nombre, tipo, unidad_id, stock_actual, stock_minimo) VALUES
 ('INS-SEM-SOJ', 'Semilla de soya certificada', 'SEMILLA',
  (SELECT unidad_id FROM unidad_medida WHERE codigo='BOL'), 200, 30),
 ('INS-FER-UREA','Urea 46%', 'FERTILIZANTE',
  (SELECT unidad_id FROM unidad_medida WHERE codigo='BOL'), 150, 25),
 ('INS-FIT-GLI', 'Herbicida glifosato', 'FITOSANITARIO',
  (SELECT unidad_id FROM unidad_medida WHERE codigo='L'),   400, 80),
 ('INS-COM-DIE', 'Diésel', 'COMBUSTIBLE',
  (SELECT unidad_id FROM unidad_medida WHERE codigo='L'),  1000, 200);

INSERT INTO movimiento_insumo (insumo_id, tipo, cantidad, saldo_resultante, usuario_id, motivo)
SELECT insumo_id, 'ENTRADA', stock_actual, stock_actual,
       (SELECT usuario_id FROM usuario WHERE username='almacen1'), 'Carga inicial (semilla)'
FROM insumo;

-- Campaña activa sobre una parcela (RN-01)
INSERT INTO campana (codigo, parcela_id, cultivo_id, fecha_inicio, fecha_fin_prevista, estado, responsable_id)
VALUES ('CAM-2026-SOJ-01',
        (SELECT p.parcela_id FROM parcela p JOIN predio pr ON pr.predio_id = p.predio_id
         WHERE pr.codigo='PRD-NORTE' AND p.codigo='P-01'),
        (SELECT cultivo_id FROM cultivo WHERE codigo='CUL-SOJ'),
        '2026-10-01', '2027-02-10', 'ACTIVA',
        (SELECT usuario_id FROM usuario WHERE username='jefe.campo'));

UPDATE parcela SET estado = 'EN_CAMPANA'
WHERE parcela_id = (SELECT parcela_id FROM campana WHERE codigo='CAM-2026-SOJ-01');

-- Labores planificadas (RN-02, RN-03)
INSERT INTO labor (campana_id, codigo, tipo, descripcion, fecha_planificada, estado, created_by) VALUES
 ((SELECT campana_id FROM campana WHERE codigo='CAM-2026-SOJ-01'), 'L-01', 'PREPARACION',
  'Preparación de suelo', '2026-10-02', 'PLANIFICADA',
  (SELECT usuario_id FROM usuario WHERE username='jefe.campo')),
 ((SELECT campana_id FROM campana WHERE codigo='CAM-2026-SOJ-01'), 'L-02', 'SIEMBRA',
  'Siembra de soya', '2026-10-08', 'ASIGNADA',
  (SELECT usuario_id FROM usuario WHERE username='jefe.campo')),
 ((SELECT campana_id FROM campana WHERE codigo='CAM-2026-SOJ-01'), 'L-03', 'CONTROL_MALEZA',
  'Aplicación de herbicida', '2026-11-05', 'PLANIFICADA',
  (SELECT usuario_id FROM usuario WHERE username='jefe.campo'));

-- Asignación al operario (RN-05)
INSERT INTO asignacion_labor (labor_id, operario_id, asignado_por)
SELECT l.labor_id,
       (SELECT usuario_id FROM usuario WHERE username='operario1'),
       (SELECT usuario_id FROM usuario WHERE username='jefe.campo')
FROM labor l
JOIN campana c ON c.campana_id = l.campana_id
WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-02';

INSERT INTO historial_estado_labor (labor_id, estado_anterior, estado_nuevo, motivo, cambiado_por)
SELECT l.labor_id, 'PLANIFICADA', 'ASIGNADA', 'Asignación a operario',
       (SELECT usuario_id FROM usuario WHERE username='jefe.campo')
FROM labor l JOIN campana c ON c.campana_id = l.campana_id
WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-02';

INSERT INTO bitacora_campo (parcela_id, campana_id, labor_id, tipo_registro, observacion, registrado_por)
SELECT c.parcela_id, c.campana_id, l.labor_id, 'OBSERVACION',
       'Campaña iniciada; suelo con humedad adecuada',
       (SELECT usuario_id FROM usuario WHERE username='jefe.campo')
FROM campana c JOIN labor l ON l.campana_id = c.campana_id
WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-01';

INSERT INTO auditoria (usuario_id, entidad, entidad_id, accion, detalle) VALUES
 ((SELECT usuario_id FROM usuario WHERE username='jefe.campo'), 'campana',
  (SELECT campana_id FROM campana WHERE codigo='CAM-2026-SOJ-01'), 'ACTIVAR', '{"origen":"semilla"}');

COMMIT;

-- Resumen
SELECT 'predio' AS tabla, COUNT(*) FROM predio
UNION ALL SELECT 'parcela', COUNT(*) FROM parcela
UNION ALL SELECT 'cultivo', COUNT(*) FROM cultivo
UNION ALL SELECT 'campana', COUNT(*) FROM campana
UNION ALL SELECT 'labor', COUNT(*) FROM labor
UNION ALL SELECT 'insumo', COUNT(*) FROM insumo;
