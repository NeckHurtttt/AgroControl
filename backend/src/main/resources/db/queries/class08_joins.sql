-- =====================================================================
-- Clase 08 — JOINs sobre relaciones reales de AgroControl
-- Datos: V2__seed_core.sql. Esquema: agrocontrol.
-- Este archivo NO es una migración (no está en db/migration): Flyway no
-- lo ejecuta. Son consultas de evidencia para correr a mano.
-- =====================================================================

-- ---------------------------------------------------------------------
-- J1. INNER JOIN de 2 tablas — usuario → rol (mi par 1:N)
-- Pregunta: ¿Qué rol tiene cada usuario?
-- La condición ON sigue la FK usuario.id_rol → rol.id_rol.
-- INNER JOIN solo devuelve filas con pareja en ambos lados.
-- ---------------------------------------------------------------------
SELECT u.nombre   AS usuario,
       u.email,
       r.nombre   AS rol,
       u.activo
FROM agrocontrol.usuario u
INNER JOIN agrocontrol.rol r ON r.id_rol = u.id_rol
ORDER BY r.nombre, u.nombre;

-- ---------------------------------------------------------------------
-- J2. JOIN de 3 tablas — labor → campana → parcela
-- Pregunta: ¿En qué parcela y en qué campaña se hace cada labor?
-- ---------------------------------------------------------------------
SELECT l.tipo            AS labor,
       l.fecha_plan,
       l.estado          AS estado_labor,
       c.fecha_inicio    AS inicio_campana,
       c.estado          AS estado_campana,
       p.codigo          AS parcela
FROM agrocontrol.labor l
JOIN agrocontrol.campana c ON c.id_campana = l.id_campana
JOIN agrocontrol.parcela p ON p.id_parcela = c.id_parcela
ORDER BY l.fecha_plan;

-- ---------------------------------------------------------------------
-- J3. JOIN con WHERE — asignacion_labor → labor → usuario
-- Pregunta: ¿Quién tiene labores pendientes (PLANIFICADA) asignadas?
-- El JOIN arma las filas; el WHERE filtra después de unirlas.
-- ---------------------------------------------------------------------
SELECT u.nombre       AS responsable,
       u.activo       AS responsable_activo,
       l.tipo         AS labor,
       l.fecha_plan
FROM agrocontrol.asignacion_labor a
JOIN agrocontrol.labor   l ON l.id_labor   = a.id_labor
JOIN agrocontrol.usuario u ON u.id_usuario = a.id_usuario
WHERE l.estado = 'PLANIFICADA'
ORDER BY l.fecha_plan;
-- Hallazgo con el seed: la FERTILIZACION pendiente está asignada a un
-- usuario INACTIVO → hay que reasignarla.

-- ---------------------------------------------------------------------
-- J4. LEFT JOIN — rol ← usuario (con conteo)
-- Pregunta: ¿Cuántos usuarios tiene cada rol, incluyendo los roles que
-- todavía no tienen ninguno?
-- LEFT JOIN conserva TODAS las filas de la tabla izquierda (rol); si no
-- hay usuario, las columnas de usuario vienen en NULL.
-- COUNT(u.id_usuario) no cuenta NULLs → da 0 para esos roles
-- (COUNT(*) daría 1, error típico).
-- ---------------------------------------------------------------------
SELECT r.nombre            AS rol,
       COUNT(u.id_usuario) AS cantidad_usuarios
FROM agrocontrol.rol r
LEFT JOIN agrocontrol.usuario u ON u.id_rol = r.id_rol
GROUP BY r.id_rol, r.nombre
ORDER BY cantidad_usuarios DESC, r.nombre;

-- ---------------------------------------------------------------------
-- J5. Sin coincidencia (LEFT JOIN + IS NULL, "anti-join")
-- Pregunta: ¿Qué labores no tienen ningún responsable asignado?
-- Se conservan todas las labores y se quedan solo las que no
-- encontraron fila en asignacion_labor.
-- ---------------------------------------------------------------------
SELECT l.id_labor, l.tipo, l.fecha_plan, l.estado
FROM agrocontrol.labor l
LEFT JOIN agrocontrol.asignacion_labor a ON a.id_labor = l.id_labor
WHERE a.id_asignacion IS NULL;

-- Otra de sin coincidencia: cultivos que nunca se sembraron en una campaña.
SELECT cu.nombre AS cultivo_sin_campanas
FROM agrocontrol.cultivo cu
LEFT JOIN agrocontrol.campana c ON c.id_cultivo = cu.id_cultivo
WHERE c.id_campana IS NULL;

-- ---------------------------------------------------------------------
-- J6. Consulta libre — rendimiento por hectárea de cada cosecha
-- Pregunta: ¿Cuánto rindió cada campaña cosechada (t/ha), en qué predio,
-- parcela y cultivo, y quién registró la cosecha?
-- 6 tablas: cosecha → campana → parcela → predio, campana → cultivo,
-- cosecha → usuario. NULLIF evita dividir por cero/NULL si falta el área.
-- ---------------------------------------------------------------------
SELECT pr.nombre                                          AS predio,
       p.codigo                                           AS parcela,
       cu.nombre                                          AS cultivo,
       co.cantidad || ' ' || co.unidad_medida             AS cosechado,
       p.area_ha,
       ROUND(co.cantidad / NULLIF(p.area_ha, 0), 2)       AS rendimiento_por_ha,
       u.nombre                                           AS registrado_por
FROM agrocontrol.cosecha co
JOIN agrocontrol.campana c  ON c.id_campana  = co.id_campana
JOIN agrocontrol.parcela p  ON p.id_parcela  = c.id_parcela
JOIN agrocontrol.predio  pr ON pr.id_predio  = p.id_predio
JOIN agrocontrol.cultivo cu ON cu.id_cultivo = c.id_cultivo
JOIN agrocontrol.usuario u  ON u.id_usuario  = co.id_usuario
ORDER BY rendimiento_por_ha DESC;
