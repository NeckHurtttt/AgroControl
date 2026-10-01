# AgroControl

Sistema de gestión de lotes agrícolas: predios, parcelas, campañas, labores, insumos y cosechas.

## Estructura del repositorio

```
AgroControl/
├── backend/    API REST · Java 21 + Spring Boot + JPA + Flyway
├── frontend/   Web · React + TypeScript + Vite
├── database/   Scripts SQL de clase (ver database/README.md)
└── docs/       Visión, glosario, requerimientos y decisiones
```

## 1. Problema
Reemplazar el registro manual y disperso de la operación agrícola por un sistema digital que dé trazabilidad completa — quién hizo qué, cuándo, con qué insumos, y con qué resultado — a nivel de parcela y campaña, sin tomar decisiones agronómicas por el usuario.
## 2. Objetivo del MVP 
Desarrollar un sistema web/móvil para planificar campañas, registrar labores e insumos, controlar responsables y capturar cosechas, ofreciendo una bitácora completa por parcela. 

## 3. Actores principales
- Administrador
- Jefe de campo 
- Operario 
- Almacenero 
- Supervisor
 ## 4. Alcance inicial 
- Predios y parcelas 
- Cultivos
- Campañas 
- Labores
- Asignaciones 
- Insumos 
- Movimientos de insumos
- Bitacora de campo 
- Cosecha
- Incidentes 
- Dashboard 
## 5. Fuera de alcance
 - Sensores IoT
- Barreras físicas 
- Facturación fiscal
- GPS en tiempo real 
- IA para autorizar reservas o calcular precios
 ## 6. Stack objetivo del semestre 
- Backend: Java 21 + Spring Boot
- Base de datos: PostgreSQL + Flyway 
- Web: React + TypeScript 
- Móvil: React Native + TypeScript 
- Pruebas API: Postman
- Contenedores: Docker / Docker Compose 
- Versionado: Git + GitHub 
- CI: GitHub Actions - IA: Spring AI, únicamente como capacidad complementaria
 ## 7. Estado actual 
- Documentación de visión, glosario, backlog y modelo relacional v0.1.
- Base de datos PostgreSQL versionada con Flyway.
- Backend con API REST de predios y parcelas (listar, obtener por id, crear), validación y Swagger.
- Frontend web conectado a la API: listado y alta de predios y parcelas.
 ## 8. Documentación 
- `docs/01-vision/vision-v0.1.md` 
- `docs/01-vision/glossary-v0.1.md` 
- `docs/02-requirements/backlog-v0.1.md`
- `docs/02-requirements/model-relational-v0.1.md`
- `docs/03-decisions/` 
## 9. Regla de trabajo
 Cada cambio importante debe ser comprensible, trazable y defendible. El repositorio es la fuente de verdad del proyecto

## 10. Base de datos
El backend (`backend/`) usa Spring Boot + Spring Data JPA + Flyway sobre PostgreSQL.

1. Crea una base de datos local vacía llamada `agrocontrol` en PostgreSQL (Flyway crea el esquema `agrocontrol` y las 15 tablas automáticamente al arrancar, usando `backend/src/main/resources/db/migration/V1__esquema_inicial.sql`).
2. Configura las credenciales por variables de entorno (opcional, ya tienen valores por defecto para desarrollo local):
   - `AGROCONTROL_DB_URL` (por defecto `jdbc:postgresql://localhost:5432/agrocontrol`)
   - `AGROCONTROL_DB_USER` (por defecto `postgres`)
   - `AGROCONTROL_DB_PASSWORD` (por defecto `postgres`)
3. Ejecuta la clase `com.agrocontrol.AgroControlApplication` (no `Main`, que sigue siendo solo una demo en memoria sin base de datos). Al iniciar, Flyway aplica la migración y la app imprime cuántos roles hay en la base de datos, confirmando la conexión.

El script original del esquema (`database/V1__esquema_inicial.sql`, dump de `pg_dump`) se mantiene como documentación de referencia; la copia ejecutada por Flyway vive en `backend/src/main/resources/db/migration/`. Los demás scripts de `database/` (creación manual, semilla y pruebas) se describen en [`database/README.md`](database/README.md).

## 11. API REST
Con el backend en marcha (`http://localhost:8080`):

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/predios` | Lista los predios |
| GET | `/api/predios/{id}` | Obtiene un predio (404 si no existe) |
| POST | `/api/predios` | Crea un predio → 201 |
| GET | `/api/parcelas?predioId=` | Lista las parcelas (opcionalmente de un predio) |
| GET | `/api/parcelas/{id}` | Obtiene una parcela (404 si no existe) |
| POST | `/api/parcelas` | Crea una parcela → 201 (404 si el predio no existe, 409 si el código ya existe en el predio) |

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- Los errores siguen un formato común (`GlobalExceptionHandler`): `{ status, error, mensaje, campos }`.
- CORS autoriza `http://localhost:5173` por defecto; se cambia con `AGROCONTROL_CORS_ORIGINS`.

## 12. Frontend web
React + TypeScript + Vite en `frontend/` (estructura por features: `predios`, `parcelas`).

```bash
cd frontend
npm install
npm run dev
```

La URL de la API se configura en `frontend/.env.development` (`VITE_API_URL=http://localhost:8080/api`). Las variables `VITE_` terminan en el navegador: nunca guardar secretos ahí.
