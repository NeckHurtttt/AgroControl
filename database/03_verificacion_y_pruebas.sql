-- =====================================================================
-- AgroControl · 03 · Verificaciones y pruebas negativas
-- Ejecutar conectado como agrocontrol_admin / agrocontrol
-- Ejecuta cada bloque por separado (Ctrl+Enter en DataGrip).
-- =====================================================================
SET search_path TO agrocontrol, public;

-- ---------------------------------------------------------------------
-- 1. ¿Dónde estoy? (Cap. 05, paso 4)
-- ---------------------------------------------------------------------
SELECT current_database() AS base_actual,
       current_schema()   AS schema_actual,
       current_user       AS usuario_actual;

-- ---------------------------------------------------------------------
-- 2. Tablas (18) y vistas (1)
-- ---------------------------------------------------------------------
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'agrocontrol'
ORDER BY table_type, table_name;

-- ---------------------------------------------------------------------
-- 3. Columnas reales de la tabla PADRE y DEPENDIENTE (Cap. 05, paso 9)
-- ---------------------------------------------------------------------
SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, is_nullable
FROM information_schema.columns
WHERE table_schema = 'agrocontrol' AND table_name = 'predio'
ORDER BY ordinal_position;

SELECT column_name, data_type, character_maximum_length, numeric_precision, numeric_scale, is_nullable
FROM information_schema.columns
WHERE table_schema = 'agrocontrol' AND table_name = 'parcela'
ORDER BY ordinal_position;

-- ---------------------------------------------------------------------
-- 4. Constraints del par 1:N
-- ---------------------------------------------------------------------
SELECT conrelid::regclass AS tabla, conname AS constraint, pg_get_constraintdef(oid) AS definicion
FROM pg_constraint
WHERE conrelid IN ('agrocontrol.predio'::regclass, 'agrocontrol.parcela'::regclass)
ORDER BY tabla, conname;

-- ---------------------------------------------------------------------
-- 5. Prueba de persistencia (Cap. 05/06): lo último guardado desde Spring
-- ---------------------------------------------------------------------
SELECT * FROM predio  ORDER BY predio_id DESC;
SELECT * FROM parcela ORDER BY parcela_id DESC;

-- ---------------------------------------------------------------------
-- 6. JOIN obligatorio del Cap. 07: cada parcela apunta a un predio válido
-- ---------------------------------------------------------------------
SELECT pa.parcela_id,
       pa.codigo        AS codigo_parcela,
       pa.nombre        AS parcela,
       pa.superficie_hectareas,
       pa.estado,
       pa.predio_id     AS fk_predio_id,
       pr.predio_id     AS pk_predio_id,
       pr.codigo        AS codigo_predio,
       pr.nombre        AS predio
FROM agrocontrol.parcela pa
JOIN agrocontrol.predio pr
  ON pr.predio_id = pa.predio_id
ORDER BY pr.codigo, pa.codigo;

-- Nota para la defensa: P-01 aparece dos veces, en predios distintos.
-- Eso es legal porque la unicidad es CONTEXTUAL: uq_parcela_predio_codigo (predio_id, codigo).

-- Superficie por predio (1:N)
SELECT pr.codigo, pr.nombre,
       COUNT(pa.parcela_id) AS parcelas,
       COALESCE(SUM(pa.superficie_hectareas), 0) AS hectareas
FROM predio pr
LEFT JOIN parcela pa ON pa.predio_id = pr.predio_id
GROUP BY pr.predio_id, pr.codigo, pr.nombre
ORDER BY pr.codigo;

-- ---------------------------------------------------------------------
-- 7. PRUEBAS NEGATIVAS (cada una DEBE fallar)
-- ---------------------------------------------------------------------

-- 7.1 UNIQUE contextual: mismo código de parcela DENTRO del mismo predio
INSERT INTO parcela (predio_id, codigo, nombre, superficie_hectareas)
VALUES ((SELECT predio_id FROM predio WHERE codigo='PRD-NORTE'), 'P-01', 'Duplicada', 10);

-- 7.2 CHECK: superficie cero o negativa
INSERT INTO parcela (predio_id, codigo, nombre, superficie_hectareas)
VALUES ((SELECT predio_id FROM predio WHERE codigo='PRD-NORTE'), 'P-99', 'Sin superficie', 0);

-- 7.3 FK: parcela de un predio inexistente
INSERT INTO parcela (predio_id, codigo, nombre, superficie_hectareas)
VALUES (9999, 'P-98', 'Parcela fantasma', 5);

-- 7.4 CHECK: estado de parcela fuera del dominio
INSERT INTO parcela (predio_id, codigo, nombre, superficie_hectareas, estado)
VALUES ((SELECT predio_id FROM predio WHERE codigo='PRD-SUR'), 'P-97', 'Estado raro', 5, 'SEMBRADA');

-- 7.5 UNIQUE: código de predio repetido
INSERT INTO predio (codigo, nombre) VALUES ('PRD-NORTE', 'Predio duplicado');

-- 7.6 CHECK: campaña que termina antes de empezar
INSERT INTO campana (codigo, parcela_id, cultivo_id, fecha_inicio, fecha_fin_prevista, responsable_id)
VALUES ('CAM-MAL-01', 1, 1, '2026-12-01', '2026-11-01', 1);

-- 7.7 CHECK (RN-03): estado de labor inválido
UPDATE labor SET estado = 'PAUSADA' WHERE codigo = 'L-01';

-- 7.8 CHECK (RN-03): completar una labor sin fecha de fin real
UPDATE labor SET estado = 'COMPLETADA' WHERE codigo = 'L-01';

-- 7.9 CHECK: cancelar una labor sin motivo
UPDATE labor SET estado = 'CANCELADA' WHERE codigo = 'L-01';

-- 7.10 CHECK (RN-04): stock de insumo negativo
UPDATE insumo SET stock_actual = -1 WHERE codigo = 'INS-FER-UREA';

-- 7.11 CHECK (RN-04): movimiento que deja saldo negativo
INSERT INTO movimiento_insumo (insumo_id, tipo, cantidad, saldo_resultante, usuario_id, labor_id)
VALUES ((SELECT insumo_id FROM insumo WHERE codigo='INS-FER-UREA'), 'SALIDA', 500, -350, 4, 2);

-- 7.12 CHECK: salida de insumo sin labor asociada (RF-11)
INSERT INTO movimiento_insumo (insumo_id, tipo, cantidad, saldo_resultante, usuario_id)
VALUES ((SELECT insumo_id FROM insumo WHERE codigo='INS-FER-UREA'), 'SALIDA', 10, 140, 4);

-- 7.13 CHECK (RN-07): consumo con cantidad cero
INSERT INTO consumo_labor (labor_id, insumo_id, movimiento_id, cantidad, unidad_id, registrado_por)
VALUES (2, 1, 1, 0, 1, 3);

-- 7.14 CHECK (RN-08): incidencia sin parcela
INSERT INTO incidencia (parcela_id, tipo, severidad, descripcion, reportado_por)
VALUES (NULL, 'PLAGA', 'ALTA', 'Sin parcela', 3);

-- 7.15 CHECK: cosecha con cantidad negativa
INSERT INTO cosecha (campana_id, fecha, cantidad, unidad_id, registrado_por)
VALUES (1, '2027-02-01', -5, 2, 2);

-- 7.16 TRIGGER (RN-09): la bitácora no se elimina
DELETE FROM bitacora_campo WHERE bitacora_id = 1;

-- 7.17 TRIGGER (RN-09): una campaña no se elimina
DELETE FROM campana WHERE codigo = 'CAM-2026-SOJ-01';

-- 7.18 FK: no se puede borrar un predio con parcelas
DELETE FROM predio WHERE codigo = 'PRD-NORTE';

-- ---------------------------------------------------------------------
-- 8. RN-01 · ¿La parcela ya tiene una campaña que se superpone?
--    Esta consulta la usará el backend antes de crear la campaña.
-- ---------------------------------------------------------------------
SELECT c.codigo, c.estado, c.fecha_inicio, c.fecha_fin_prevista
FROM campana c
WHERE c.parcela_id = (SELECT p.parcela_id FROM parcela p
                      JOIN predio pr ON pr.predio_id = p.predio_id
                      WHERE pr.codigo='PRD-NORTE' AND p.codigo='P-01')
  AND c.estado IN ('PLANIFICADA','ACTIVA')                 -- las canceladas no ocupan
  AND c.fecha_inicio       <= DATE '2027-01-15'            -- fin solicitado
  AND c.fecha_fin_prevista >= DATE '2026-12-01';           -- inicio solicitado

-- ---------------------------------------------------------------------
-- 9. Flujo crítico: ejecutar la labor asignada consumiendo insumo (RN-04)
--    Movimiento + stock + consumo + bitácora en UNA transacción.
-- ---------------------------------------------------------------------
BEGIN;

-- 9.1 El operario inicia la labor asignada (RN-05: sólo si la tiene asignada)
UPDATE labor SET estado = 'EN_EJECUCION', fecha_inicio_real = now(), updated_at = now()
WHERE labor_id = (SELECT l.labor_id FROM labor l JOIN campana c ON c.campana_id = l.campana_id
                  WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-02')
  AND EXISTS (SELECT 1 FROM asignacion_labor a
              WHERE a.labor_id = labor.labor_id AND a.activo
                AND a.operario_id = (SELECT usuario_id FROM usuario WHERE username='operario1'));

INSERT INTO historial_estado_labor (labor_id, estado_anterior, estado_nuevo, motivo, cambiado_por)
SELECT l.labor_id, 'ASIGNADA', 'EN_EJECUCION', 'Inicio desde móvil',
       (SELECT usuario_id FROM usuario WHERE username='operario1')
FROM labor l JOIN campana c ON c.campana_id = l.campana_id
WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-02';

-- 9.2 Salida de insumo con saldo calculado (RN-04)
INSERT INTO movimiento_insumo (insumo_id, tipo, cantidad, saldo_resultante, usuario_id, labor_id, motivo)
SELECT i.insumo_id, 'SALIDA', 40, i.stock_actual - 40,
       (SELECT usuario_id FROM usuario WHERE username='almacen1'),
       (SELECT l.labor_id FROM labor l JOIN campana c ON c.campana_id = l.campana_id
        WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-02'),
       'Entrega para siembra'
FROM insumo i WHERE i.codigo = 'INS-SEM-SOJ';

UPDATE insumo SET stock_actual = stock_actual - 40, updated_at = now()
WHERE codigo = 'INS-SEM-SOJ';

-- 9.3 El consumo queda asociado a la labor (RF-11) con unidad explícita (RN-07)
INSERT INTO consumo_labor (labor_id, insumo_id, movimiento_id, cantidad, unidad_id, registrado_por)
SELECT m.labor_id, m.insumo_id, m.movimiento_id, m.cantidad, i.unidad_id,
       (SELECT usuario_id FROM usuario WHERE username='operario1')
FROM movimiento_insumo m
JOIN insumo i ON i.insumo_id = m.insumo_id
WHERE m.tipo = 'SALIDA' AND i.codigo = 'INS-SEM-SOJ'
ORDER BY m.movimiento_id DESC
LIMIT 1;

-- 9.4 Cierre de la labor y bitácora
UPDATE labor SET estado = 'COMPLETADA', fecha_fin_real = now(), updated_at = now()
WHERE labor_id = (SELECT l.labor_id FROM labor l JOIN campana c ON c.campana_id = l.campana_id
                  WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-02');

INSERT INTO historial_estado_labor (labor_id, estado_anterior, estado_nuevo, motivo, cambiado_por)
SELECT l.labor_id, 'EN_EJECUCION', 'COMPLETADA', 'Reporte de fin desde móvil',
       (SELECT usuario_id FROM usuario WHERE username='operario1')
FROM labor l JOIN campana c ON c.campana_id = l.campana_id
WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-02';

INSERT INTO bitacora_campo (parcela_id, campana_id, labor_id, tipo_registro, observacion, registrado_por)
SELECT c.parcela_id, c.campana_id, l.labor_id, 'AVANCE_LABOR',
       'Siembra completada en 25,5 ha; se usaron 40 bolsas de semilla',
       (SELECT usuario_id FROM usuario WHERE username='operario1')
FROM campana c JOIN labor l ON l.campana_id = c.campana_id
WHERE c.codigo='CAM-2026-SOJ-01' AND l.codigo='L-02';

COMMIT;

-- ---------------------------------------------------------------------
-- 10. RF-15 · Bitácora por parcela
-- ---------------------------------------------------------------------
SELECT * FROM vw_bitacora_parcela
WHERE codigo_parcela = 'P-01'
ORDER BY registrado_at;

-- ---------------------------------------------------------------------
-- 11. RF-16 · Avance por campaña
-- ---------------------------------------------------------------------
SELECT c.codigo,
       COUNT(*) FILTER (WHERE l.estado = 'COMPLETADA') AS completadas,
       COUNT(*) AS total_labores,
       ROUND(100.0 * COUNT(*) FILTER (WHERE l.estado = 'COMPLETADA') / COUNT(*), 1) AS avance_pct
FROM campana c
JOIN labor l ON l.campana_id = c.campana_id
GROUP BY c.codigo;

-- ---------------------------------------------------------------------
-- 12. Insumos bajo mínimo
-- ---------------------------------------------------------------------
SELECT i.codigo, i.nombre, i.stock_actual, i.stock_minimo, u.codigo AS unidad
FROM insumo i
JOIN unidad_medida u ON u.unidad_id = i.unidad_id
WHERE i.stock_actual <= i.stock_minimo
ORDER BY i.codigo;
