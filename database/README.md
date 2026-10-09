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

- `V1__esquema_inicial.sql`: dump de `pg_dump` del esquema inicial (15 tablas). Es la base de la migración que ejecuta Flyway.
