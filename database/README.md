# Scripts de base de datos

Scripts SQL de PostgreSQL usados en clase para crear y probar la base `agrocontrol`.
El backend **no** ejecuta estos archivos: Flyway usa su propia copia en
`backend/src/main/resources/db/migration/`.

## Orden de ejecución manual (DataGrip / psql)

| Orden | Archivo | Conectado como | Qué hace |
|-------|---------|----------------|----------|
| 1 | `00_admin_crear_usuario_y_base.sql` | `postgres` / base `postgres` | Crea el usuario `agrocontrol_admin` y la base `agrocontrol`. Cambiar la contraseña antes de ejecutar y no subirla. |
| 2 | `V1__creacion_completa_agrocontrol.sql` | `agrocontrol_admin` / `agrocontrol` | Crea el schema `agrocontrol` con 18 tablas y la vista de bitácora por parcela. |
| 3 | `V2__datos_semilla.sql` | `agrocontrol_admin` / `agrocontrol` | Datos semilla mínimos: roles, usuarios de ejemplo, predios, parcelas, cultivos, campañas, labores e insumos. |
| 4 | `03_verificacion_y_pruebas.sql` | `agrocontrol_admin` / `agrocontrol` | Consultas de verificación y pruebas negativas de restricciones. Ejecutar bloque por bloque. |

## Referencia

- `V1__esquema_inicial.sql`: dump de `pg_dump` del esquema inicial (15 tablas). Es **idéntico** a la V1 que ejecuta Flyway (se quitaron las líneas `\restrict` que agrega `pg_dump` 17.6, que solo entiende `psql` y hacían fallar el script en DataGrip).

## Cuál es la fuente de verdad

El esquema que usa la aplicación es el de **Flyway** (`backend/src/main/resources/db/migration/`, V1 a V4). `V1__creacion_completa_agrocontrol.sql` es el script de la clase y crea un modelo más amplio: además de las 15 tablas tiene `historial_estado_labor`, `unidad_medida`, `usuario_rol` y la vista `vw_bitacora_parcela`, que el backend no usa. Sirve para practicar consultas, no para levantar la app.

| Migración Flyway | Qué hace |
|---|---|
| V1 | Esquema `agrocontrol` con las 15 tablas |
| V2 | Datos semilla (roles, usuarios, predios, parcelas, campañas, labores, insumos, cosecha) |
| V3 | Contraseñas BCrypt reales para los usuarios semilla (`agro123`) y el supervisor |
| V4 | `CHECK` de estado en `campana`, `labor` y `parcela` |
| V5 | Índices de `auditoria` (por entidad y por fecha) |
| V6 | Estado `EN_CURSO` en labores; estado, resolución y fecha de resolución en incidencias |
| V7 | Categoría y stock mínimo de insumos; carga de ejemplo de diésel, gasolina, aceite, grasa y repuestos (con sus movimientos) |
