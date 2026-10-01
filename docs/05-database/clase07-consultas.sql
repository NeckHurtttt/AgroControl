-- =====================================================================
-- Clase 07 — Consultas SELECT sobre una tabla (AgroControl)
-- Datos: V2__seed_core.sql. Esquema: agrocontrol.
-- Cada consulta responde una pregunta real del negocio.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Q1. Listado ordenado
-- Pregunta: ¿Qué parcelas hay, agrupadas por predio y en orden de código?
-- (Vista base para el jefe de campo al planificar.)
-- ---------------------------------------------------------------------
SELECT id_predio, codigo, area_ha, estado
FROM agrocontrol.parcela
ORDER BY id_predio, codigo;

-- ---------------------------------------------------------------------
-- Q2. Filtro simple (WHERE con una condición)
-- Pregunta: ¿Qué usuarios están activos y pueden operar el sistema?
-- ---------------------------------------------------------------------
SELECT id_usuario, nombre, email
FROM agrocontrol.usuario
WHERE activo = true
ORDER BY nombre;

-- ---------------------------------------------------------------------
-- Q3. AND / OR (con paréntesis para controlar la precedencia)
-- Pregunta: ¿A qué personal de campo (operarios o jefe de campo) se le
-- pueden asignar labores? Tiene que estar ACTIVO.
-- Con paréntesis: (operario OR jefe) AND activo  → Luis, Marta.
-- Sin paréntesis, AND se evalúa antes que OR:
--   operario OR (jefe AND activo) → aparece también Ana Vaca (INACTIVA). Error.
-- ---------------------------------------------------------------------
SELECT id_usuario, nombre, email, activo
FROM agrocontrol.usuario
WHERE (email ILIKE 'operario%' OR email ILIKE 'jefe%')
  AND activo = true
ORDER BY nombre;

-- ---------------------------------------------------------------------
-- Q4. IN
-- Pregunta: ¿Qué labores de establecimiento del cultivo (siembra o
-- fertilización) hay registradas?
-- IN reemplaza a varios OR sobre la misma columna.
-- ---------------------------------------------------------------------
SELECT id_labor, id_campana, tipo, fecha_plan, estado
FROM agrocontrol.labor
WHERE tipo IN ('SIEMBRA', 'FERTILIZACION')
ORDER BY fecha_plan;

-- ---------------------------------------------------------------------
-- Q5. BETWEEN (rango inclusivo en ambos extremos)
-- Pregunta: ¿Qué campañas empezaron durante el primer semestre 2026?
-- ---------------------------------------------------------------------
SELECT id_campana, id_parcela, fecha_inicio, estado
FROM agrocontrol.campana
WHERE fecha_inicio BETWEEN DATE '2026-01-01' AND DATE '2026-06-30'
ORDER BY fecha_inicio;

-- ---------------------------------------------------------------------
-- Q6. LIKE / ILIKE
-- Pregunta: ¿Qué cuentas corresponden a operarios? (búsqueda por patrón
-- en el email, sin importar mayúsculas: ILIKE es propio de PostgreSQL;
-- LIKE distingue mayúsculas).
-- ---------------------------------------------------------------------
SELECT id_usuario, nombre, email, activo
FROM agrocontrol.usuario
WHERE email ILIKE 'operario%';

-- Variante con LIKE: predios cuyo nombre empieza con "Fundo".
SELECT id_predio, nombre, ubicacion
FROM agrocontrol.predio
WHERE nombre LIKE 'Fundo%';

-- ---------------------------------------------------------------------
-- Q7. IS NULL
-- Pregunta: ¿Qué parcelas no tienen el área registrada? (dato faltante
-- que impide calcular rendimiento por hectárea).
-- Ojo: "area_ha = NULL" nunca es verdadero; hay que usar IS NULL.
-- ---------------------------------------------------------------------
SELECT id_parcela, id_predio, codigo
FROM agrocontrol.parcela
WHERE area_ha IS NULL;

-- ---------------------------------------------------------------------
-- Q8. IS NULL (campañas en curso)
-- Pregunta: ¿Qué campañas siguen en curso? (fecha_fin sin cargar)
-- ---------------------------------------------------------------------
SELECT id_campana, id_parcela, fecha_inicio, estado
FROM agrocontrol.campana
WHERE fecha_fin IS NULL
ORDER BY fecha_inicio;

-- ---------------------------------------------------------------------
-- Q9. Propia del dominio: labores atrasadas
-- Pregunta: ¿Qué labores tenían que hacerse antes de hoy y todavía no
-- se ejecutaron? (alerta para el jefe de campo).
-- ---------------------------------------------------------------------
SELECT id_labor, id_campana, tipo, fecha_plan,
       CURRENT_DATE - fecha_plan AS dias_de_atraso
FROM agrocontrol.labor
WHERE fecha_plan < CURRENT_DATE
  AND estado <> 'EJECUTADA'
ORDER BY dias_de_atraso DESC;

-- ---------------------------------------------------------------------
-- Q10. Propia del dominio: insumos con stock bajo
-- Pregunta: ¿Qué insumos debe reponer el almacenero? (umbral: < 100)
-- ---------------------------------------------------------------------
SELECT id_insumo, nombre, unidad_medida, stock_actual
FROM agrocontrol.insumo
WHERE stock_actual < 100
ORDER BY stock_actual;
