# Matriz de requisitos y reglas de negocio — Parcial 1

Fuente: *Banco Oficial de Proyectos II, Programación Aplicada 2026-2*, proyecto 16 (AgroControl), secciones E y G.
La numeración sigue el banco; `backlog-v0.1.md` es el backlog inicial del equipo y tiene numeración propia.

**Leyenda de estado:** ✅ implementado y demostrable · 🟡 parcial · ⏳ planificado para un corte posterior.
**Corte:** P1 = Parcial 1 · TP = Trabajos prácticos integradores · P2 = Parcial 2 · EF = Examen final.

## 1. Requisitos funcionales

| RF | Requisito | Corte | Estado | Evidencia (backend → web → móvil) |
|----|-----------|-------|--------|-----------------------------------|
| RF-01 | Gestionar predios y parcelas | P1 | ✅ | `/api/predios`, `/api/parcelas` (CRUD) → pantallas Predios y Parcelas → móvil: Parcelas y Detalle de parcela |
| RF-02 | Gestionar cultivos | P1 | ✅ | `GET/POST /api/cultivos` → pantalla Cultivos |
| RF-03 | Crear campañas | P1 | ✅ | `POST /api/campanas`, `/iniciar`, `/finalizar` → pantalla Campañas → móvil: campañas en Detalle de parcela |
| RF-04 | Planificar labores | P1 | ✅ | `POST /api/labores` → pantalla Labores → móvil: Mis labores |
| RF-05 | Asignar operarios | TP | ⏳ | Tabla `asignacion_labor` y entidad `AsignacionLabor` creadas; falta `POST /tasks/{id}/assign` |
| RF-06 | Consultar agenda de campo | TP | 🟡 | Móvil "Mis labores" lista labores por fecha; se filtrará por operario cuando exista la asignación (RF-05) |
| RF-07 | Iniciar/completar labor | P1 | 🟡 | `POST /api/labores/{id}/ejecutar` (PLANIFICADA → EJECUTADA) → web y móvil; faltan estados intermedios (RN-03) |
| RF-08 | Registrar observación de campo | TP | ⏳ | Tabla `bitacora_campo` y entidad `BitacoraCampo` creadas |
| RF-09 | Gestionar insumos | P1 | ✅ | `GET/POST /api/insumos` → pantalla Insumos |
| RF-10 | Registrar entradas/salidas de insumos | P1 | ✅ | `POST /api/insumos/{id}/movimientos` (ENTRADA/SALIDA) → pantalla Insumos |
| RF-11 | Asociar consumo a labor | P1 | ✅ | `POST /api/labores/{id}/consumos` → web Labores → móvil: Detalle de labor → Registrar consumo |
| RF-12 | Validar stock antes de consumo | P1 | ✅ | `InventarioService`: 409 si la cantidad supera el stock (RN-04) |
| RF-13 | Registrar incidencias | P2 | ⏳ | Tabla `incidencia` y entidad `Incidencia` creadas |
| RF-14 | Registrar cosecha | P1 | ✅ | `POST /api/cosechas` → pantalla Cosechas |
| RF-15 | Consultar bitácora por parcela | TP | ⏳ | Depende de RF-08 (`GET /plots/{id}/logbook`) |
| RF-16 | Consultar avance por campaña | TP | 🟡 | `GET /api/labores?campanaId=` y Detalle de parcela en móvil; falta el % de avance |
| RF-17 | Mostrar KPIs operativos | P2 | 🟡 | Panel de inicio web con conteos en vivo; falta `GET /dashboard` |
| RF-18 | Auditar cambios críticos | P2 | ⏳ | Tabla `auditoria` y entidad `Auditoria` creadas |

**Resumen del corte:** 9 ✅ · 4 🟡 · 5 ⏳. Los 18 RF tienen tabla en el modelo relacional (migración `V1__esquema_inicial.sql`).

## 2. Reglas de negocio

| RN | Regla | Corte | Estado | Dónde se valida |
|----|-------|-------|--------|-----------------|
| RN-01 | Una parcela no tiene campañas superpuestas | P1 | ✅ | `CampanaService.crear`: 409 si la parcela ya tiene una campaña sin finalizar |
| RN-02 | Toda labor pertenece a una campaña y parcela | P1 | ✅ | FK `labor.id_campana` NOT NULL; la parcela se obtiene de la campaña; `LaborService.planificar` exige campaña existente y no finalizada |
| RN-03 | Estados de labor: planificada, asignada, en ejecución, completada, cancelada | TP | 🟡 | Hoy: PLANIFICADA → EJECUTADA, sin volver atrás (`Labor.ejecutar`). Faltan ASIGNADA, EN_EJECUCION y CANCELADA |
| RN-04 | El consumo no supera el stock disponible | P1 | ✅ | `InventarioService.registrarConsumo` (409) + el stock solo cambia por movimientos, en la misma transacción |
| RN-05 | Los operarios solo reportan labores asignadas | TP | ⏳ | Requiere RF-05 y autenticación |
| RN-06 | La cosecha se registra contra campaña activa/finalizable | P1 | ✅ | `CosechaService`: 409 si la campaña está PLANIFICADA |
| RN-07 | Cantidades y unidades explícitas | P1 | ✅ | `insumo.unidad_medida` NOT NULL; `cosecha.unidad`; `@DecimalMin` y `@Digits` en los DTO |
| RN-08 | Incidencias vinculadas a parcela/campaña/labor | P2 | ⏳ | FKs ya modeladas en `incidencia` |
| RN-09 | No se elimina historial de campañas terminadas | P1 | ✅ | No existe `DELETE` de campañas; no se borra una parcela con campañas (409) |
| RN-10 | La IA no prescribe dosis ni tratamientos | EF | ⏳ | No hay IA en este corte |

## 3. Trazabilidad del flujo del corte

| Paso del flujo crítico | RF / RN | Endpoint | Web | Móvil |
|------------------------|---------|----------|-----|-------|
| Jefe crea campaña sobre parcela | RF-03 · RN-01 | `POST /api/campanas` | Campañas | Detalle de parcela (consulta) |
| Planifica labores | RF-04 · RN-02 | `POST /api/labores` | Labores | Mis labores (consulta) |
| Almacén entrega insumo | RF-10 · RN-07 | `POST /api/insumos/{id}/movimientos` | Insumos | — |
| Operario registra consumo | RF-11 · RF-12 · RN-04 | `POST /api/labores/{id}/consumos` | Labores | Detalle de labor |
| Operario completa la labor | RF-07 · RN-03 | `POST /api/labores/{id}/ejecutar` | Labores | Detalle de labor |
| Se registra la cosecha | RF-14 · RN-06 | `POST /api/cosechas` | Cosechas | — |
