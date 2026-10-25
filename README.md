# AgroControl

Sistema de gestión de lotes agrícolas: predios, parcelas, campañas, labores, insumos y cosechas.

## Capturas

| Panel principal | Predios |
|---|---|
| ![Inicio](docs/capturas/inicio.png) | ![Predios](docs/capturas/predios.png) |
| **Parcelas** | **Labores** |
| ![Parcelas](docs/capturas/parcelas.png) | ![Labores](docs/capturas/labores.png) |
| **Insumos** | **Cosechas** |
| ![Insumos](docs/capturas/insumos.png) | ![Cosechas](docs/capturas/cosechas.png) |

## Estructura del repositorio

```
AgroControl/
├── backend/            API REST · Java 21 + Spring Boot + JPA + Flyway
├── frontend/           Web · React + TypeScript + Vite
├── agrocontrol-mobile/  App móvil de las guías · React Native + TypeScript (Expo)
├── database/           Scripts SQL de clase (ver database/README.md)
└── docs/               Visión, glosario, requerimientos y decisiones
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
- Backend con API REST de roles, usuarios, predios, parcelas, cultivos, campañas, labores, insumos y cosechas, con validación, CORS y Swagger.
- Frontend web conectado a la API para todo el flujo: predio → parcela → campaña → labores e insumos → cosecha.
- App móvil (Expo) conectada a la misma API: mis labores, detalle de labor (ejecutar y registrar consumo) y parcelas con sus campañas.
- Pendiente: incidencias, bitácora de campo, asignación de labores, auditoría, autenticación y tests automatizados.
 ## 8. Documentación 
- `docs/01-vision/vision-v0.1.md` 
- `docs/01-vision/glossary-v0.1.md` 
- `docs/02-requirements/backlog-v0.1.md`
- `docs/02-requirements/model-relational-v0.1.md`
- `docs/02-requirements/matriz-rf-rn-parcial1.md` (18 RF y 10 RN del banco, con corte, estado y evidencia)
- `docs/02-requirements/casos-de-uso-flujo1.md` (casos de uso del primer flujo en Given-When-Then)
- `docs/03-decisions/` 
## 9. Regla de trabajo
 Cada cambio importante debe ser comprensible, trazable y defendible. El repositorio es la fuente de verdad del proyecto

## 10. Base de datos
El backend (`backend/`) usa Spring Boot + Spring Data JPA + Flyway sobre PostgreSQL.

1. Crea una base de datos local vacía llamada `agrocontrol` en PostgreSQL (Flyway crea el esquema `agrocontrol` y las 15 tablas automáticamente al arrancar y aplica las migraciones V1 a V4: esquema, semilla, contraseñas de demo y `CHECK` de estados; ver [`database/README.md`](database/README.md)). Con Docker también sirve `docker compose up -d`, que levanta Postgres 17 en el puerto 5433.
2. Configura las credenciales por variables de entorno (opcional, ya tienen valores por defecto para desarrollo local):
   - `AGROCONTROL_DB_URL` (por defecto `jdbc:postgresql://localhost:5432/agrocontrol`)
   - `AGROCONTROL_DB_USER` (por defecto `postgres`)
   - `AGROCONTROL_DB_PASSWORD` (por defecto `postgres`)
3. Ejecuta la clase `com.agrocontrol.AgroControlApplication` (no `Main`, que sigue siendo solo una demo en memoria sin base de datos). Al iniciar, Flyway aplica la migración y la app imprime cuántos roles hay en la base de datos, confirmando la conexión.

El script original del esquema (`database/V1__esquema_inicial.sql`, dump de `pg_dump`) se mantiene como documentación de referencia; la copia ejecutada por Flyway vive en `backend/src/main/resources/db/migration/`. Los demás scripts de `database/` (creación manual, semilla y pruebas) se describen en [`database/README.md`](database/README.md).

## 11. API REST
Con el backend en marcha (`http://localhost:8080`). Swagger UI: `http://localhost:8080/swagger-ui.html`. Ejemplos listos en [`requests.http`](requests.http).

| Recurso | Endpoints | Reglas principales |
|---------|-----------|--------------------|
| Roles | `GET/POST /api/roles`, `GET/PUT/DELETE /api/roles/{id}` | Nombre único (409); no se borra un rol con usuarios (409) |
| Login | `POST /api/auth/login`, `GET /api/auth/me` | Email o contraseña incorrectos dan el mismo 401; usuario inactivo no entra |
| Usuarios | `GET/POST /api/usuarios`, `GET /api/usuarios/{id}` | Rol existente (404); email único (409); contraseña con BCrypt |
| Predios | `GET/POST /api/predios`, `GET/PUT/DELETE /api/predios/{id}` | No se borra un predio con parcelas (409) |
| Parcelas | `GET/POST /api/parcelas?predioId=`, `GET/PUT/DELETE /api/parcelas/{id}` | Código único por predio (409); no se borra con campañas (409) |
| Cultivos | `GET/POST /api/cultivos` | Nombre único (409) |
| Campañas | `GET/POST /api/campanas?parcelaId=`, `POST /{id}/iniciar`, `POST /{id}/finalizar` | Una campaña abierta por parcela (409); transiciones PLANIFICADA → EN_CURSO → FINALIZADA |
| Labores | `GET/POST /api/labores?campanaId=`, `POST /{id}/ejecutar`, `GET/POST /{id}/consumos`, `GET /asignaciones`, `POST /{id}/asignaciones` | No se planifica, ejecuta ni consume en una campaña finalizada (409); el consumo descuenta stock y registra una SALIDA en la misma transacción; el operario solo toca sus labores asignadas (403) |
| Insumos | `GET/POST /api/insumos`, `GET/POST /api/insumos/{id}/movimientos` | El stock solo cambia por movimientos; no puede quedar negativo (409); la fila se bloquea (`SELECT … FOR UPDATE`) para que dos movimientos simultáneos no se pisen |
| Cosechas | `GET/POST /api/cosechas?campanaId=` | Solo campañas EN_CURSO o FINALIZADA (409) |
| Incidencias | `GET/POST /api/incidencias?parcelaId=` | Parcela, campaña o labor (al menos una) y coherentes entre sí |

- Errores con formato `ProblemDetail` (`type`, `title`, `status`, `detail`, `instance` y `errores` por campo en los 400), desde `GlobalExceptionHandler`.
- CORS autoriza `http://localhost:5173` (web) y `http://localhost:8081` (Expo web) por defecto; se cambia con `AGROCONTROL_CORS_ORIGINS`.
- Tests: `mvn test` corre los unitarios (Mockito y MockMvc con la seguridad real) y `PersistenciaPostgresTest`, que levanta un PostgreSQL 17 con Testcontainers para probar migraciones, mapeos y el bloqueo de stock. Sin Docker ese test se salta.

### Login y permisos por rol
Toda la API (salvo `POST /api/auth/login`, `/api/health` y Swagger) exige `Authorization: Bearer <token>`. El token es un JWT HS256 que dura 8 h; su `sub` es el id del usuario, y el backend lo usa como "quién registra" en cosechas, consumos, movimientos e incidencias (el cliente ya no manda `usuarioId`). `SecurityConfig` aplica la matriz de permisos: **401** sin token y **403** si el rol no puede hacer la operación. La web oculta además lo que el rol no puede usar.

| Rol | Email | Ve / puede |
| --- | --- | --- |
| Administrador | sergio@agrocontrol.com | Todo, incluida la pantalla Usuarios; único que edita predios y parcelas |
| Jefe de campo | jefe@agrocontrol.com | Cultivos, campañas, planificar labores y asignar operarios, cosechas, incidencias |
| Operario | operario1@agrocontrol.com | "Mis labores" (solo las asignadas): ejecutar, registrar insumos usados y reportar incidencias |
| Almacenero | almacen@agrocontrol.com | Insumos y movimientos, registrar cosechas |
| Supervisor | supervisor@agrocontrol.com | Todo en solo lectura e indicadores |

Contraseña de demo de todos: `agro123` (migración `V3__usuarios_login.sql`). La clave de firma se cambia con `AGROCONTROL_JWT_SECRET` (mínimo 32 caracteres) y la duración con `AGROCONTROL_JWT_HORAS`.

### Arquitectura por módulo
```
<modulo>/
├── domain/                       Entidad + puerto de salida (<Entidad>Repository)
├── application/                  Casos de uso (<Entidad>Service, sin anotaciones de Spring salvo @Transactional)
└── infrastructure/
    ├── config/                   @Bean que crea el servicio
    └── adapter/
        ├── in/web/               @RestController + DTOs (records)
        └── out/persistence/      JpaRepository + PersistenceAdapter (implementa el puerto)
```
El dominio no conoce JPA: cada entidad tiene su `*JpaEntity` y su `*PersistenceMapper` en `out/persistence/`, y los estados son `enum` del dominio (ver `docs/06-defensa/notas-capitulo-05.md`).

## 12. Frontend web
React + TypeScript + Vite en `frontend/`, organizado por features: `auth`, `predios`, `parcelas`, `cultivos`, `campanas`, `labores`, `insumos`, `cosechas`, `incidencias` y `usuarios`. Se entra con login, y el menú, las rutas y los botones dependen del rol. El panel de inicio resume la operación con datos en vivo.

```bash
cd frontend
npm install
npm run dev
```

La URL de la API se configura en `frontend/.env.development` (`VITE_API_URL=http://localhost:8080/api`). Las variables `VITE_` terminan en el navegador: nunca guardar secretos ahí.

### Una sola aplicación (entrega / despliegue)
El perfil Maven `fullstack` compila el frontend y lo mete en el jar del backend, que sirve la web y la API desde el mismo puerto (sin CORS):

```bash
cd backend
mvn -Pfullstack package
java -jar target/AgroControl-1.0-SNAPSHOT.jar   # web en http://localhost:8080, API en /api, Swagger en /swagger-ui.html
```

El perfil descarga su propio Node en `backend/target/` (no hace falta tenerlo instalado) y construye con `npm run build:jar`, que usa `frontend/.env.jar` (`VITE_API_URL=/api`). Las rutas de React (`/predios`, `/parcelas`...) las resuelve `SpaConfig`, que responde `index.html`. Para desarrollar se siguen usando `mvn spring-boot:run` y `npm run dev` por separado.

## 13. App móvil
Expo + React Native + TypeScript en `agrocontrol-mobile/`, la app de las guías móviles (01 y 02, más la vista de siembras). Adapta ParkFlow360 Mobile al dominio de AgroControl (Predio → Parcela, 1:N) y por ahora usa datos de demo, sin API ni login. Detalle de cada guía en [`agrocontrol-mobile/README.md`](agrocontrol-mobile/README.md).

```bash
cd agrocontrol-mobile
npm install
emulator -avd AgroControl &   # o encenderlo desde el Device Manager de Android Studio
npm run android               # instala Expo Go en el emulador y abre la app
```

Expo encuentra el emulador con `ANDROID_HOME` (normalmente `~/Android/Sdk`). Si dice "No Android connected device found", falta esa variable o el emulador no está encendido.

## 14. Estrategia Git
- `main` es la rama estable: siempre compila y arranca.
- Cada tema se trabaja en una rama propia (`feat/...`, `fix/...`, `docs/...`, `defensa/...`) y entra a `main` con un pull request revisado por otro integrante, por ejemplo `defensa/cierre-gaps`.
- Los commits siguen Conventional Commits (`feat(api): ...`, `fix: ...`, `docs: ...`, `chore: ...`), un cambio coherente por commit.
- Remotos del equipo: `origin` (SalinasMiguel/AgroControl) y el fork `NeckHurtttt/AgroControl`.

