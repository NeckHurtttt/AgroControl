# Notas de defensa — Clase 06: dataset semilla (`V2__seed_core.sql`)

> ⚠️ No tuve el PDF de esta clase: se armó con tu diagnóstico ("dataset mínimo coherente, 2–5 filas").

## Qué se implementó

`backend/src/main/resources/db/migration/V2__seed_core.sql`: una migración **nueva** de Flyway que solo hace `INSERT`. **No** toca `V1__esquema_inicial.sql` ni cambia ninguna tabla.

| Tabla | Filas | Detalle pensado para las consultas |
|---|---|---|
| `rol` | 5 | ADMINISTRADOR, JEFE_DE_CAMPO, OPERARIO, ALMACENERO, SUPERVISOR |
| `usuario` | 5 | Ana Vaca queda **inactiva**; SUPERVISOR queda **sin usuarios** |
| `predio` | 3 | "Predio El Retiro" con `ubicacion` NULL y `activo = false` |
| `parcela` | 5 | Código `P-01`/`P-02` repetido **en distintos predios** (UNIQUE es por predio); Las Palmeras P-02 con `area_ha` NULL |
| `cultivo` | 4 | Caña de azúcar con `ciclo_dias` NULL y **sin campañas** |
| `campana` | 4 | 1 FINALIZADA (Soya), 3 PLANIFICADA con `fecha_fin` NULL |
| `labor` | 5 | La FERTILIZACION está atrasada (plan 15/03, sin ejecutar); el RIEGO queda **sin responsable** |
| `asignacion_labor` | 5 | La FERTILIZACION pendiente está asignada a la usuaria **inactiva** |
| `insumo` | 3 | 2 con stock bajo (< 100) |
| `cosecha` | 1 | 135 t de soya en 45 ha → 3 t/ha |

Verificado: arrancando la app contra una BD vacía, Flyway aplica `V1` y luego `V2` ("Successfully applied 2 migrations… now at version v2"), y `GET /api/roles` devuelve los 5 roles del seed.

## Por qué se decidió así

**1. ¿Por qué una migración V2 y no editar V1?** Flyway guarda en `flyway_schema_history` el *checksum* de cada migración aplicada. Si edito V1, en la próxima ejecución el checksum no coincide y Flyway **se niega a arrancar** (error de validación). Regla: una migración aplicada es inmutable; todo cambio es una migración nueva con versión mayor.

**2. FKs por subconsulta en vez de ids fijos.**
```sql
(SELECT id_rol FROM agrocontrol.rol WHERE nombre = 'OPERARIO')
```
Si escribiera `id_rol = 3`, dependería de que la secuencia haya empezado en 1 y de que nadie haya insertado antes (por ejemplo, un POST de prueba). Con la clave natural (`nombre` es UNIQUE) el script funciona sin importar los ids generados. Tampoco hace falta ajustar las secuencias con `setval`, porque nunca se insertan ids a mano.

**3. `INSERT ... SELECT ... FROM (VALUES ...)` en labor y asignacion_labor.** Permite escribir los datos como una tabla literal y resolver varias FK con JOIN de una sola vez. En `labor` además garantiza que `labor.id_parcela` sea **la misma** parcela de su campaña (se toma de `c.id_parcela`), así no se generan datos incoherentes.

**4. Datos "con trampa" a propósito.** Cada caso borde existe para que una consulta de las clases 07/08 tenga algo que mostrar: sin NULLs no se puede demostrar `IS NULL`, y sin un rol vacío no se ve la diferencia entre `INNER JOIN` y `LEFT JOIN`.

**5. Estados.** Uso solo los valores que ya usa el código de dominio (`PLANIFICADA`, `FINALIZADA`, `EJECUTADA`, `DISPONIBLE`). El modelo relacional (RN-03) todavía tiene pendiente definir los CHECK de estados, así que no inventé otros.

## ⚠️ Importante al correr la app

Tu base local `agrocontrol` está en la versión 1. La próxima vez que arranques `AgroControlApplication`, **Flyway aplicará V2 automáticamente** e insertará estos datos. Si antes creaste a mano un rol con uno de esos nombres (ej. via POST), V2 fallará por el UNIQUE de `rol.nombre`: lo borrás y volvés a arrancar.

## Qué me pueden preguntar

- ¿Por qué no modificaste V1? → Checksum (punto 1).
- ¿Cómo sabe Flyway qué migraciones faltan? → Compara los archivos `V<n>__*.sql` con la tabla `flyway_schema_history` y aplica en orden las que no están.
- ¿Por qué no pusiste los ids a mano? → Punto 2.
- ¿El seed respeta las restricciones? → Sí: `CHECK area_ha > 0` (o NULL), `fecha_fin >= fecha_inicio`, `cantidad > 0`, UNIQUE `(id_predio, codigo)`, `(id_labor, id_usuario)`. Si algo las violara, Flyway haría rollback de toda la migración (en PostgreSQL cada migración corre en una transacción).
