# Notas de defensa — Clase 07: consultas sobre una tabla

> ⚠️ No tuve el PDF de esta clase: se armó con tu diagnóstico (≥ 8 consultas: listado ordenado, filtro simple, AND/OR, IN/BETWEEN, LIKE/ILIKE, IS NULL, una del dominio).

Archivo: `docs/05-database/clase07-consultas.sql`: 10 consultas (+1 variante), todas probadas contra el seed.

| # | Técnica | Pregunta de negocio | Resultado con el seed |
|---|---|---|---|
| Q1 | `ORDER BY` de 2 columnas | Parcelas por predio y código | 5 filas |
| Q2 | `WHERE` simple | Usuarios activos | 4 (Ana Vaca no) |
| Q3 | `AND` / `OR` con paréntesis | Personal de campo asignable (operario o jefe, **y** activo) | Luis, Marta |
| Q4 | `IN` | Labores de siembra o fertilización | 3 |
| Q5 | `BETWEEN` | Campañas iniciadas en el 1.er semestre 2026 | 3 |
| Q6 | `ILIKE` / `LIKE` | Cuentas de operarios / predios "Fundo…" | 2 / 2 |
| Q7 | `IS NULL` | Parcelas sin área cargada | Las Palmeras P-02 |
| Q8 | `IS NULL` | Campañas en curso (sin fecha_fin) | 3 |
| Q9 | Dominio (aritmética de fechas) | Labores atrasadas y días de atraso | FERTILIZACION, 198 días |
| Q10 | Dominio (umbral) | Insumos con stock bajo | Glifosato, Urea |

## Lo que tengo que saber explicar

**Q3: la precedencia de AND sobre OR (la pregunta más probable).**
```sql
WHERE (email ILIKE 'operario%' OR email ILIKE 'jefe%') AND activo = true   -- Luis, Marta
WHERE  email ILIKE 'operario%' OR email ILIKE 'jefe%'  AND activo = true   -- Ana Vaca, Luis, Marta  ← ¡incorrecto!
```
Sin paréntesis, SQL evalúa `AND` primero: queda `operario OR (jefe AND activo)`, y entra la operaria inactiva. Lo probé con los dos WHERE sobre el seed: 2 filas vs. 3.

**`BETWEEN` es inclusivo:** `BETWEEN '2026-01-01' AND '2026-06-30'` incluye ambos días. Equivale a `>= ... AND <= ...`.

**`IN` vs varios `OR`:** `tipo IN ('SIEMBRA','FERTILIZACION')` = `tipo = 'SIEMBRA' OR tipo = 'FERTILIZACION'`. Más corto y sin riesgo de precedencia.

**`LIKE` vs `ILIKE`:** `%` = cualquier cantidad de caracteres, `_` = exactamente uno. `LIKE` distingue mayúsculas; `ILIKE` no (es una extensión de PostgreSQL, no es SQL estándar).

**¿Por qué `IS NULL` y no `= NULL`?** NULL significa "desconocido"; cualquier comparación con NULL da *desconocido* (ni true ni false), y el WHERE solo deja pasar true. `area_ha = NULL` no devuelve **nunca** nada.

**Q9: aritmética de fechas.** En PostgreSQL `date - date` da un entero (días). `CURRENT_DATE` es la fecha del servidor, así que el resultado cambia según el día en que se corra. Además el alias `dias_de_atraso` se puede usar en `ORDER BY` pero **no** en `WHERE`: el WHERE se evalúa antes que el SELECT.

**Orden lógico de ejecución** (para cualquier pregunta de "¿por qué no puedo usar el alias aquí?"): `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`.
