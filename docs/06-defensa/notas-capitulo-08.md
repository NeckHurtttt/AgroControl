# Notas de defensa — Clase 08: JOINs

> ⚠️ No tuve el PDF de esta clase: se armó con tu diagnóstico (INNER de 2 tablas, JOIN de 3, JOIN + WHERE, LEFT JOIN, sin coincidencia con IS NULL, una libre).

Archivo: `backend/src/main/resources/db/queries/class08_joins.sql`: está en `db/queries`, **no** en `db/migration`, así que Flyway no lo ejecuta; son consultas de evidencia.

| # | Tipo | Relación real | Pregunta | Resultado con el seed |
|---|---|---|---|---|
| J1 | INNER JOIN, 2 tablas | usuario → rol | ¿Qué rol tiene cada usuario? | 5 filas; **SUPERVISOR no aparece** |
| J2 | JOIN de 3 tablas | labor → campana → parcela | ¿Dónde y en qué campaña se hace cada labor? | 5 filas |
| J3 | JOIN + WHERE | asignacion_labor → labor → usuario | ¿Quién tiene labores pendientes? | FERTILIZACION → Ana Vaca (**inactiva**) |
| J4 | LEFT JOIN + COUNT | rol ← usuario | Usuarios por rol, incluidos los vacíos | SUPERVISOR = **0** |
| J5 | Sin coincidencia (LEFT JOIN + IS NULL) | labor ← asignacion_labor; cultivo ← campana | Labores sin responsable / cultivos nunca sembrados | RIEGO / Caña de azúcar |
| J6 | Libre, 6 tablas | cosecha → campana → parcela → predio, cultivo, usuario | Rendimiento t/ha por cosecha | Soya, Fundo San José P-01, 3.00 t/ha |

## Lo que tengo que saber explicar

**INNER vs LEFT, con mi propio dato:** en J1 (INNER) el rol SUPERVISOR **desaparece** porque no tiene ningún usuario con quien emparejarse. En J4 (LEFT, con `rol` a la izquierda) **aparece** con 0. INNER = solo filas con pareja en ambos lados; LEFT = todas las filas de la izquierda, y NULL en las columnas de la derecha si no hay pareja.

**`COUNT(u.id_usuario)` vs `COUNT(*)` en J4:** para SUPERVISOR el LEFT JOIN produce **una** fila con las columnas de usuario en NULL. `COUNT(*)` cuenta filas, así que daría 1 (incorrecto). `COUNT(columna)` ignora NULLs y da 0 (correcto).

**Anti-join (J5):** `LEFT JOIN ... WHERE derecha.pk IS NULL` = "filas de la izquierda que **no** tienen pareja". Se chequea la PK de la derecha (`a.id_asignacion`) porque es NOT NULL en la tabla: si viene NULL, es seguro que fue por falta de pareja y no por un dato vacío. Equivalente: `WHERE NOT EXISTS (SELECT 1 FROM asignacion_labor a WHERE a.id_labor = l.id_labor)`.

**WHERE en un JOIN (J3):** primero se arman las filas combinadas y después el WHERE filtra. Ojo: en un LEFT JOIN, poner una condición de la tabla derecha en el **WHERE** lo convierte en la práctica en un INNER (se eliminan las filas con NULL); si se quiere conservar, la condición va en el **ON**.

**J3 encontró un problema de negocio real en los datos:** una labor pendiente está asignada a una usuaria inactiva. Este es el tipo de control que justifica la consulta.

**J2: el código de parcela no alcanza para identificarla.** `P-01` aparece dos veces porque el UNIQUE es `(id_predio, codigo)`: existe P-01 en San José **y** en Las Palmeras. Para identificarla sin ambigüedad hay que sumar el predio (lo hace J6). Buen punto para mostrar que entiendo el UNIQUE compuesto.

**Redundancia a mencionar si preguntan por el modelo:** `labor` tiene `id_parcela` **y** `id_campana`, y la campaña ya tiene parcela. Es una desnormalización: podría quedar inconsistente si alguien carga una parcela distinta a la de la campaña. En el seed se evita tomando `c.id_parcela`; en el modelo se podría proteger con una FK compuesta o eliminando la columna.

**J6: `NULLIF(p.area_ha, 0)`** devuelve NULL si el área es 0, y `x / NULL = NULL` en vez de un error de división por cero. `ROUND(..., 2)` deja 2 decimales. Si la parcela tiene `area_ha` NULL (como Las Palmeras P-02), el rendimiento sale NULL: dato faltante, no un error.

**Alias de tabla (`u`, `r`, `l`, `c`...)**: obligatorios cuando dos tablas tienen columnas con el mismo nombre (`nombre` está en `usuario`, `rol`, `predio`, `cultivo`); si no, PostgreSQL da error de "column reference is ambiguous".

**Relación con JPA (cap. 05):** J1 es exactamente el SQL que Hibernate generaría si navegara `UsuarioJpaEntity.rol` con un JOIN. Con `FetchType.LAZY` **no** lo hace hasta que se pide algo del rol aparte del id.
