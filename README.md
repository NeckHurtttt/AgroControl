# AgroControl

Sistema de gestión de lotes agrícolas: predios, parcelas, campañas, labores, insumos y cosechas.

## Estructura del repositorio

```
AgroControl/
├── backend/    API REST · Java 21 + Spring Boot + JPA + Flyway
├── frontend/   Web · React + TypeScript + Vite
├── mobile/     App móvil · React Native + TypeScript (Expo)
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

1. Crea una base de datos local vacía llamada `agrocontrol` en PostgreSQL (Flyway crea el esquema `agrocontrol` y las 15 tablas automáticamente al arrancar, usando `backend/src/main/resources/db/migration/V1__esquema_inicial.sql`).
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
| Usuarios | `GET/POST /api/usuarios`, `GET /api/usuarios/{id}` | Rol existente (404); email único (409); contraseña con BCrypt |
| Predios | `GET/POST /api/predios`, `GET/PUT/DELETE /api/predios/{id}` | No se borra un predio con parcelas (409) |
| Parcelas | `GET/POST /api/parcelas?predioId=`, `GET/PUT/DELETE /api/parcelas/{id}` | Código único por predio (409); no se borra con campañas (409) |
| Cultivos | `GET/POST /api/cultivos` | Nombre único (409) |
| Campañas | `GET/POST /api/campanas?parcelaId=`, `POST /{id}/iniciar`, `POST /{id}/finalizar` | Una campaña abierta por parcela (409); transiciones PLANIFICADA → EN_CURSO → FINALIZADA |
| Labores | `GET/POST /api/labores?campanaId=`, `POST /{id}/ejecutar`, `GET/POST /{id}/consumos` | No se planifica en campaña finalizada (409); el consumo descuenta stock y registra una SALIDA en la misma transacción |
| Insumos | `GET/POST /api/insumos`, `GET/POST /api/insumos/{id}/movimientos` | El stock solo cambia por movimientos; no puede quedar negativo (409) |
| Cosechas | `GET/POST /api/cosechas?campanaId=` | Solo campañas EN_CURSO o FINALIZADA (409) |

- Errores con formato `ProblemDetail` (`type`, `title`, `status`, `detail`, `instance` y `errores` por campo en los 400), desde `GlobalExceptionHandler`.
- CORS autoriza `http://localhost:5173` (web) y `http://localhost:8081` (Expo web) por defecto; se cambia con `AGROCONTROL_CORS_ORIGINS`.

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
Rol y Usuario separan además el dominio de la entidad JPA (`*JpaEntity` + mapper); el resto de entidades siguen anotadas con `@Entity` en `domain/` (ver `docs/06-defensa/notas-capitulo-05.md`).

## 12. Frontend web
React + TypeScript + Vite en `frontend/`, organizado por features: `predios`, `parcelas`, `cultivos`, `campanas`, `labores`, `insumos`, `cosechas` y `usuarios`. El panel de inicio resume la operación con datos en vivo.

```bash
cd frontend
npm install
npm run dev
```

La URL de la API se configura en `frontend/.env.development` (`VITE_API_URL=http://localhost:8080/api`). Las variables `VITE_` terminan en el navegador: nunca guardar secretos ahí.

## 13. App móvil
React Native + TypeScript con Expo en `mobile/`, orientada al operario de campo. Consume la misma API que la web.

| Pantalla | Qué hace | Endpoints |
|----------|----------|-----------|
| Mis labores | Lista las labores (pendientes primero); se refresca al volver o deslizando | `GET /api/labores` |
| Detalle de labor | Marca la labor como ejecutada y registra el consumo de insumos; muestra el 409 si no hay stock | `GET /api/labores/{id}`, `POST /{id}/ejecutar`, `GET/POST /{id}/consumos`, `GET /api/insumos`, `GET /api/usuarios` |
| Parcelas | Lista las parcelas con área y estado | `GET /api/parcelas` |
| Detalle de parcela | Campañas de la parcela y sus labores | `GET /api/campanas?parcelaId=`, `GET /api/labores` |

```bash
cd mobile
npm install
npx expo start --web     # en el navegador: http://localhost:8081
npx expo start           # en el celular: escanear el QR con Expo Go
```

La URL de la API se toma de `EXPO_PUBLIC_API_URL` (por defecto `http://localhost:8080/api`; ver `mobile/.env.example`). En el celular `localhost` es el propio teléfono, así que hay que usar la IP de la PC en la misma red, por ejemplo `EXPO_PUBLIC_API_URL=http://192.168.1.50:8080/api npx expo start`. El backend ya autoriza por CORS el origen `http://localhost:8081` de Expo web.

## 14. Estrategia Git
- `main` es la rama estable: siempre compila y arranca.
- Cada tema se trabaja en una rama propia (`feat/...`, `fix/...`, `docs/...`, `defensa/...`) y entra a `main` con un pull request revisado por otro integrante, por ejemplo `defensa/cierre-gaps`.
- Los commits siguen Conventional Commits (`feat(api): ...`, `fix: ...`, `docs: ...`, `chore: ...`), un cambio coherente por commit.
- Remotos del equipo: `origin` (SalinasMiguel/AgroControl) y el fork `NeckHurtttt/AgroControl`.

