# Resumen general — Estado de AgroControl para la defensa

Par 1:N asignado: **Rol → Usuario** (`usuario.id_rol → rol.id_rol`). Package `com.agrocontrol`, esquema `agrocontrol`.

## Estado por capítulo

| Cap. | Tema | Estado | Evidencia principal | Notas |
|---|---|---|---|---|
| 01 | Java 21 esencial | ✅ Cerrado (previo) | `Rol`, `Usuario`, `EstadoUsuario`, `Main` | — |
| 02 | Contratos, colecciones, Optional, excepciones | ✅ Cerrado | `RolService`, `RolRepositoryEnMemoria`, 2 excepciones, `RegistrarUsuarioCommand`, `Main` con caminos + y − | [notas-capitulo-02](notas-capitulo-02.md) |
| 03 | Spring Boot base | ✅ Cerrado | `/api/health`, `ProjectInfoService`, `/api/roles/demo`, `requests.http` | [notas-capitulo-03](notas-capitulo-03.md) |
| 04 | Spring MVC, DTO, validación | ✅ Cerrado (guía 04 + ampliación del banco) | `RolController` (POST/GET/GET{id}/**PUT/DELETE**), `UsuarioController` (POST/GET{id}), DTOs, `GlobalExceptionHandler`; probados 200/201/204/400/404/409 | [notas-capitulo-04](notas-capitulo-04.md) |
| 05 | JPA/Hibernate | ✅ Rol/Usuario (bidireccional, `@Transactional`) · 🟡 resto del modelo sin refactor | Dominio puro + `*JpaEntity` + mapper + adapter; `@ManyToOne(LAZY)` + `@OneToMany(mappedBy)`; dirty checking y carrera UNIQUE verificados con log SQL | [notas-capitulo-05](notas-capitulo-05.md) |
| 06 | Dataset semilla | ✅ Cerrado | `V2__seed_core.sql` (10 tablas, aplicada por Flyway en BD de prueba) | [notas-capitulo-06](notas-capitulo-06.md) |
| 07 | Consultas de una tabla | ✅ Cerrado | `docs/05-database/clase07-consultas.sql` (10 consultas, probadas) | [notas-capitulo-07](notas-capitulo-07.md) |
| 08 | JOINs | ✅ Cerrado | `db/queries/class08_joins.sql` (6 tipos, probados) | [notas-capitulo-08](notas-capitulo-08.md) |

⚠️ **Caps. 05–08 se armaron sin sus PDFs** (solo estaban las guías 01–04 en el disco). Cuando las tengas, compará los nombres de archivos, paquetes y la lista de entregables. El banco de 50 preguntas **sí** se usó (ver checklist abajo).

## Pendientes / cosas que conviene saber antes de la defensa

- [ ] **Flyway aplicará V2 en tu BD local** la próxima vez que arranques la app (hoy está en v1). Es lo esperado.
- [ ] Las **13 entidades restantes** siguen como `@Entity` en `domain/` (justificación en notas 05). Ahora predio, parcela, cultivo, campaña, labor, insumo y cosecha ya tienen puerto en `domain/`, servicio en `application/` y adaptadores en `infrastructure/adapter/{in/web,out/persistence}`, igual que Rol/Usuario. Solo falta separar `*JpaEntity` + mapper.
- [ ] **No hay tests automatizados** en `src/test` (P49, pendiente por decisión). La verificación fue manual: `Main`, curl contra todos los endpoints con SQL de Hibernate visible, y un test temporal de persistencia que se borró porque requiere PostgreSQL.
- [ ] Ids `Long` en Java vs `integer` en PostgreSQL: funciona, pero `ddl-auto=validate` lo marcaría.
- [x] README actualizado (estado actual, tabla de endpoints y arquitectura por módulo).
- [x] Commits por capítulo en la rama `defensa/cierre-gaps` (cada uno compila por sí solo):
  1. `feat(java): aplicar interfaces colecciones optional y excepciones al dominio` (cap. 02)
  2. `feat: bootstrap Spring Boot backend and first REST endpoints` (cap. 03)
  3. `feat: add REST API and validation for rol` (cap. 04)
  4. `refactor(persistence): separar dominio y entidades JPA de rol y usuario` (cap. 05)
  5. `feat(db): seed V2 y consultas de clases 07 y 08` (clases 06–08)
  6. `feat: PUT/DELETE de rol, alta de usuario, mappedBy y límites transaccionales` (banco)
  7. `docs(defensa): notas de estudio por capítulo y checklist contra el banco`
  8. `chore(config): mostrar el SQL de Hibernate en consola para la defensa`
- [x] `defensa/cierre-gaps` mergeada a `main` junto con el frontend y los módulos nuevos.

## Checklist contra el banco oficial de 50 preguntas

> Fuente: `~/Descargas/EXAMEN PROGRAMACION APLICADA 2026-1.pdf` → "Banco de 50 preguntas — Defensa oral del backend".
> Regla del banco: *"una definición memorizada sin poder ubicarla y justificarla en el propio código se considera respuesta incompleta"*.
> **Fallar 2 o más CRÍTICAS obliga a una repregunta técnica adicional.**

**Rutas:** `…/` = `backend/src/main/java/com/agrocontrol/`

**Leyenda:**
- ✅ Se responde con código real.
- 🟡 Parcial: se explica, pero falta código o evidencia para la repregunta.
- ❌ No hay código: solo se puede responder con teoría.
- 🔴 **CRÍTICA sin cubrir: prioridad alta.**

### Resumen de CRÍTICAS (15)

| # | Tema | Estado |
|---|---|---|
| P01 | Arquitectura real y recorrido entre paquetes | ✅ |
| P05 | Regla de dependencias | ✅ |
| P11 | Recorrido HTTP → PostgreSQL → HTTP | ✅ |
| P15 | POST línea por línea (incluye ManyToOne y padre inexistente) | ✅ |
| P16 | GET por id (incluye 404) | ✅ |
| P18 | PUT e idempotencia | ✅ |
| P19 | DELETE e hijos en 1:N | ✅ |
| P28 | Cardinalidad 1:N en tablas | ✅ |
| P29 | @OneToMany y @ManyToOne con mi relación | ✅ |
| P30 | Lado propietario, mappedBy, @JoinColumn | ✅ |
| P33 | LAZY/EAGER y defaults | ✅ |
| P35 | Recursión infinita en JSON | ✅ |
| P43 | record para DTOs | ✅ |
| P45 | Responsabilidades del Service | ✅ |
| P50 | Monolito hexagonal → microservicios | 🟡 |

**Balance (tras implementar los pendientes 1–5): 14 cubiertas · 1 parcial (P50, defendible reconociendo el acoplamiento) · 0 en 🔴.**

---

### Bloque A — Arquitectura, hexagonal, MVC y Spring

| # | Pregunta | Estado | Evidencia / qué falta |
|---|---|---|---|
| **P01 CRÍTICA** | Dibujar la arquitectura real y el recorrido entre paquetes | ✅ | Dominio `…/rol/domain/Rol.java`; aplicación `…/rol/application/RolService.java`; adaptador de entrada `…/rol/infrastructure/adapter/in/web/RolController.java`; adaptador de salida `…/rol/infrastructure/adapter/out/persistence/RolPersistenceAdapter.java`. **Repregunta** ("si muevo el Controller a `domain`, ¿compila?"): sí compila, porque Java no conoce capas. Pero `domain` pasaría a depender de Spring MVC y se rompe la regla de dependencias. Diagrama en `notas-capitulo-05.md`. |
| P02 | Qué es hexagonal y qué problema resuelve | ✅ | `notas-capitulo-05.md`. **Repregunta** (cambiar PostgreSQL): cambia solo `…/*/infrastructure/adapter/out/persistence/`; no cambian `RolService`, `Rol` ni `RolRepository`. La prueba es `…/Main.java`, que ya usa otra persistencia: `…/rol/infrastructure/memory/RolRepositoryEnMemoria.java`. |
| P03 | Dominio vs aplicación vs infraestructura con clases reales | ✅ | Las mismas clases que P01. **Repregunta** ("@Entity en el dominio"): justo el caso de las otras 13 entidades (`…/predio/domain/Predio.java`, etc.). La versión estricta es la de Rol/Usuario. |
| P04 | Puertos de entrada y salida | 🟡 | Salida: `…/rol/domain/RolRepository.java` y `…/usuario/domain/UsuarioRepository.java`. **Entrada: no hay interfaz de caso de uso**; el controller depende de la clase concreta `RolService`. Es defendible ("el servicio es el puerto de entrada; con un solo cliente no se justificaba una interfaz"), pero hay que decirlo. **Repregunta** ("¿JpaRepository es puerto?"): no. `…/rol/infrastructure/adapter/out/persistence/RolJpaRepository.java` es un detalle de infraestructura; el puerto es `RolRepository`. |
| **P05 CRÍTICA** | Regla de dependencias y si el proyecto la cumple | ✅ | `…/rol/domain`, `…/usuario/domain` y `…/*/application` **no importan** `infrastructure`, JPA ni Hibernate (verificado con grep). Imports para defender o reconocer: (1) `Rol.java` → `usuario.domain.Usuario`: dominio→dominio, aceptable. (2) `…/usuario/application/UsuarioService.java` → `rol.domain.RolRepository` y `RolNoEncontradoException`: aplicación→**puerto** de otro módulo, aceptable porque depende de la abstracción y no del adapter. (3) `…/rol/application/RolService.java` → `org.springframework.transaction.annotation.Transactional`: la única dependencia de Spring en `application`, una **concesión consciente** (ver `notas-capitulo-05.md`). (4) `…/shared/web/GlobalExceptionHandler.java` → excepciones de `rol` y `usuario`: infraestructura→dominio, aceptable. (5) Infraestructura entre módulos: `UsuarioPersistenceAdapter` → `RolJpaRepository`, y `RolJpaEntity` ⇄ `UsuarioJpaEntity` (bidireccional). Es acoplamiento real a nivel de persistencia (ver P50). |
| P06 | MVC vs hexagonal | ✅ | MVC termina en `RolController` (entra `CrearRolRequest`, sale `RolResponse`) y el caso de uso empieza en `service.registrar(...)`: `…/rol/infrastructure/adapter/in/web/RolController.java`. |
| P07 | Dónde están Model, View y Controller en REST | ✅ | Controller = `RolController`; Model = `RolResponse` (no la entidad); View = el JSON que genera Jackson (`HttpMessageConverter`), sin ViewResolver. |
| P08 | @SpringBootApplication y main() | ✅ | `…/AgroControlApplication.java`; `notas-capitulo-03.md`. |
| P09 | IoC, DI, constructor injection | ✅ | `…/shared/web/HealthController.java`, `…/rol/infrastructure/config/RolConfig.java` (`@Bean` que crea `RolService`). |
| P10 | Auditoría de todas las anotaciones | ✅ | Están todas las que lista el banco, salvo `@Service` en el dominio (los servicios se registran con `@Bean`: `…/rol/infrastructure/config/RolConfig.java`, `…/usuario/infrastructure/config/UsuarioConfig.java`). Web: `RolController` (`@PutMapping`, `@DeleteMapping`, …). Transacción: `@Transactional` en `RolService`/`UsuarioService`. JPA: `@OneToMany` en `RolJpaEntity`, `@ManyToOne` + `@JoinColumn` en `UsuarioJpaEntity`, `@Query` en `RolJpaRepository`. Consecuencias de quitar `mappedBy`, `@Valid` y `@JoinColumn`: `notas-capitulo-05.md` y `-04.md`. |

### Bloque B — HTTP, MVC y CRUD end-to-end

| # | Pregunta | Estado | Evidencia / qué falta |
|---|---|---|---|
| **P11 CRÍTICA** | Recorrido exacto HTTP → PostgreSQL → HTTP | ✅ | `RolController.crear` → `RolService.registrar` → `RolRepository` → `RolPersistenceAdapter` → `RolPersistenceMapper` → `RolJpaRepository.save` → INSERT. JSON→Java: Jackson, al resolver `@RequestBody`. Java→JSON: Jackson, al escribir el `ResponseEntity`. Flujo en `notas-capitulo-03.md` y `-04.md`. Para la demo en vivo, `spring.jpa.show-sql=true` ya está en `…/resources/application.properties`: cada request muestra su SQL en la consola. |
| P12 | @Controller vs @RestController | ✅ | `…/rol/infrastructure/adapter/in/web/RolController.java`. Rutas: `/api/roles`, `/api/roles/{id}`, `/api/roles/demo`, `/api/health`. |
| P13 | PathVariable / RequestParam / RequestBody | ✅ | Los tres están en `RolController` (`/{id}`, `?nombre=`, `CrearRolRequest`). **Repregunta** (hijos por estado): `GET /api/roles/{id}/usuarios?estado=ACTIVO`. El padre va en el path y el filtro en la query. |
| P14 | Swagger vs Postman vs navegador | ✅ | `springdoc-openapi-starter-webmvc-ui` en `backend/pom.xml` → Swagger UI en `http://localhost:8080/swagger-ui.html`; `requests.http` como cliente alternativo; el frontend React como tercer cliente. Los tres entran por el mismo `DispatcherServlet` → controller → service. |
| **P15 CRÍTICA** | POST línea por línea, ManyToOne al asignar padre, padre inexistente | ✅ | Hijo: `…/usuario/infrastructure/adapter/in/web/UsuarioController.java` → `…/usuario/application/UsuarioService.java` → `…/usuario/infrastructure/adapter/out/persistence/UsuarioPersistenceAdapter.java` (`getReferenceById` asigna el padre en el `@ManyToOne` sin SELECT) → INSERT → 201. **Repregunta** (padre inexistente): se detecta en `UsuarioService.registrar` **antes** del INSERT → `RolNoEncontradoException` → **404** (probado). Persist vs merge: POST sin id = persist (INSERT); PUT con id = merge + dirty checking. SQL real en `notas-capitulo-04.md`. |
| **P16 CRÍTICA** | GET por id, incluido el no existe | ✅ | `RolController.buscarPorId` → `RolService.obtener` (`orElseThrow`) → `…/rol/domain/exception/RolNoEncontradoException.java` → `GlobalExceptionHandler` → 404. También `GET /api/usuarios/{id}` → `UsuarioNoEncontradoException` → 404. Probados 200 y 404. ¿Se carga la relación? `RolJpaEntity.usuarios` es `@OneToMany` **LAZY** y no se toca al mapear, así que no se consulta la tabla `usuario`. **Repregunta** (`.get()` vs `orElseThrow`): `.get()` lanza `NoSuchElementException`, que termina en 500; `orElseThrow` expresa el caso de negocio y da 404. |
| P17 | GET de listado y riesgos | 🟡 | `RolController.listar` → `findAll()` **sin paginación**. Hay que reconocer el riesgo. N+1: evidencia LAZY en `notas-capitulo-05.md`. |
| **P18 CRÍTICA** | PUT completo e idempotencia | ✅ | `RolController.actualizar` (`@PutMapping("/{id}")`) + `…/rol/infrastructure/adapter/in/web/dto/ActualizarRolRequest.java` → `RolService.actualizar` (404 si no existe; nombre único **excluyendo el propio** → 409) → merge → UPDATE por dirty checking. **Idempotencia demostrada:** un PUT idéntico repetido **no emitió UPDATE**. **Repregunta** (save con id sin verificar): no crea nada, porque `obtener(id)` corta antes con 404. `notas-capitulo-04.md`. |
| **P19 CRÍTICA** | DELETE completo y qué pasa con los hijos | ✅ | `RolController.eliminar` (`@DeleteMapping`) → `RolService.eliminar` → `RolJpaRepository.contarUsuarios` (`@Query` sobre `join r.usuarios`) → si tiene usuarios, `…/rol/domain/exception/RolConUsuariosException.java` → **409**; si no, `deleteById` → DELETE → **204**. FK sin `ON DELETE`, `@OneToMany` sin cascade ni orphanRemoval: los usuarios **nunca** se borran solos. **Repregunta** (`CascadeType.ALL`): borraría personas con su historial; se decide por negocio. Probados 409, 204 y 404. |
| P20 | 200/201/204/400/404/409/500 | ✅ | Probados todos menos 500: 200 (GET/PUT), 201 (POST), **204 (DELETE)**, 400 (`@Valid`), 404 (rol/usuario inexistente, padre inexistente), 409 (duplicado, rol con usuarios, carrera UNIQUE). **Repregunta** (409 mejor que 400): email ya registrado. El formato es válido (no es 400) pero choca con el estado actual. 500 queda solo para errores no previstos. |
| P21 | @Valid y momento de validación | ✅ | `…/rol/infrastructure/adapter/in/web/dto/CrearRolRequest.java`, `…/usuario/infrastructure/adapter/in/web/dto/CrearUsuarioRequest.java` (`@NotNull` en `rolId` vs `@NotBlank` en textos). **Repregunta** (correo duplicado): `@Email` valida el formato y `UsuarioService.registrar` la unicidad → 409 (probado con el mismo email en MAYÚSCULAS). |
| P22 | @RestControllerAdvice | ✅ | `…/shared/web/GlobalExceptionHandler.java` (`ProblemDetail`: type, title, status, detail, instance y `errores` por campo). |
| P23 | @Transactional y límite de transacción | ✅ | `…/rol/application/RolService.java` y `…/usuario/application/UsuarioService.java`: escrituras con `@Transactional`, lecturas con `readOnly = true`. El límite es el **caso de uso**: "verificar + escribir" es una unidad. Rollback ante `RuntimeException`. Evidencia del persistence context compartido (merge sin SELECT extra): `notas-capitulo-05.md`. |
| P24 | CORS | ✅ | `…/shared/web/CorsConfig.java` (`WebMvcConfigurer.addCorsMappings` sobre `/api/**`, origen tomado de `agrocontrol.cors.allowed-origins`, por defecto `http://localhost:5173`). Probado: preflight `OPTIONS` desde `:5173` → 200 con `Access-Control-Allow-Origin`; desde otro origen → 403. Postman no sufre CORS porque no es un navegador. |

### Bloque C — JPA, Hibernate, cardinalidad y PostgreSQL

| # | Pregunta | Estado | Evidencia / qué falta |
|---|---|---|---|
| P25 | @Entity y @Table | ✅ | `…/rol/infrastructure/adapter/out/persistence/RolJpaEntity.java` (`schema = "agrocontrol"`). **Repregunta** (renombrar tabla): falla en runtime con "relation does not exist" al primer SQL; con `ddl-auto=validate` fallaría al arrancar. |
| P26 | @Id / @GeneratedValue | ✅ | `RolJpaEntity`, `IDENTITY` + secuencia `rol_id_rol_seq`. Con IDENTITY el id existe **después** del INSERT (`returning id_rol` en el log de `notas-capitulo-05.md`). |
| P27 | @Column vs constraint real | ✅ | `RolJpaEntity`/`UsuarioJpaEntity` vs `V1__esquema_inicial.sql`. Con `ddl-auto=none`, `@Column` solo documenta y **PostgreSQL tiene la última palabra**. |
| **P28 CRÍTICA** | Cardinalidad 1:N en tablas | ✅ | `rol(id_rol PK)` ← `usuario(id_rol FK NOT NULL)`, constraint `usuario_id_rol_fkey` en `…/resources/db/migration/V1__esquema_inicial.sql`. La FK está en la hija porque cada usuario tiene **un** rol; en la padre haría falta una lista, cosa que una columna relacional no admite. `notas-capitulo-02.md`. |
| **P29 CRÍTICA** | @OneToMany y @ManyToOne con mi relación | ✅ | `@ManyToOne(fetch = LAZY, optional = false)` en `…/usuario/infrastructure/adapter/out/persistence/UsuarioJpaEntity.java` y `@OneToMany(mappedBy = "rol", fetch = LAZY)` en `…/rol/infrastructure/adapter/out/persistence/RolJpaEntity.java`. **Bidireccional.** Cardinalidad relacional: una FK en `usuario`; en Java se navega desde los dos lados. **Repregunta** (solo @ManyToOne): la FK sigue igual y se pierde `rol.getUsuarios()` y el `join r.usuarios` del `@Query`. `notas-capitulo-05.md`. |
| **P30 CRÍTICA** | Lado propietario, mappedBy, @JoinColumn | ✅ | Propietario: `UsuarioJpaEntity.rol` con `@JoinColumn(name = "id_rol")`. Inverso: `RolJpaEntity.usuarios` con `mappedBy = "rol"`, que es el **atributo Java**, no la columna. **Repregunta** (`mappedBy = "id_rol"`): la app no arranca por una `AnnotationException` al construir el EntityManagerFactory. `notas-capitulo-05.md`. |
| P31 | cascade y CascadeType.ALL | ✅ | **Decisión explícita en código:** `RolJpaEntity.usuarios` **sin** `cascade` (comentario en la clase). **Repregunta** (por negocio): borrar OPERARIO no debe borrar a Luis y Ana; el DELETE responde 409 (probado). |
| P32 | orphanRemoval vs REMOVE | 🟡 | Existe la colección (`RolJpaEntity.usuarios`) y **sin** `orphanRemoval` a propósito. Se explica qué pasaría (quitar de la lista → `DELETE FROM usuario`), pero no hay código que lo ejecute. |
| **P33 CRÍTICA** | LAZY/EAGER y defaults | ✅ | `UsuarioJpaEntity`: `@ManyToOne(fetch = FetchType.LAZY, optional = false)`. Default de `@ManyToOne` = EAGER (por eso se declara LAZY); default de `@OneToMany` = LAZY. Log de Hibernate que muestra la relectura sin JOIN: `notas-capitulo-05.md`. |
| P34 | Sincronizar ambos lados en memoria | 🟡 | El lado inverso `RolJpaEntity.getUsuarios()` es **no modificable** y sin `addUsuario()` a propósito: se modifica solo por el lado propietario. En el dominio: `…/rol/domain/Rol.java` → `agregarUsuario()`. Se explica qué debería hacer un helper (setear `usuario.rol` **y** agregar a la lista), pero no está implementado. |
| **P35 CRÍTICA** | Recursión infinita en JSON | ✅ | No se exponen entidades: `…/rol/infrastructure/adapter/in/web/dto/RolResponse.java` no tiene `usuarios`, así que no hay ciclo posible. **Repregunta** (`@JsonIgnore`): el DTO define el contrato a propósito; `@JsonIgnore` es un parche sobre la entidad y acopla el JSON a JPA. |
| P36 | Persistence context y dirty checking | ✅ | Evidencia con SQL real (`notas-capitulo-05.md`): en `PUT`, `obtener` deja el rol **managed**, el merge no hace otro SELECT y el UPDATE sale al commit. Con un PUT idéntico, **no hubo UPDATE**. |
| P37 | Estados transient/managed/detached/removed | 🟡 | Ejemplo real: `UsuarioPersistenceMapper.toEntity` → **transient**; `save` (persist) → **managed**; al terminar la transacción de `UsuarioService` → **detached** (`open-in-view=false`); `deleteById` en `RolService.eliminar` → **removed** → DELETE al commit. Es teoría apoyada en el código; no hay demostración aislada de cada estado. |
| P38 | N+1 | ✅ | `notas-capitulo-05.md` (LAZY + log SQL). Soluciones: fetch join, EntityGraph, proyección DTO. |
| P39 | ddl-auto y por qué update no | ✅ | `…/resources/application.properties` (`ddl-auto=none`) + Flyway `V1`/`V2`. Justificación completa en `notas-capitulo-05.md`, sección "ddl-auto". |
| P40 | Desde save() hasta PostgreSQL | ✅ | `RolPersistenceAdapter.guardar` → `SimpleJpaRepository.save` → `EntityManager.persist` → Hibernate → JDBC → PostgreSQL. **Repregunta** (demostrar el INSERT): log SQL o `SELECT` en DataGrip. `spring.jpa.show-sql=true` está activo en `application.properties`: el `insert into agrocontrol.rol ...` aparece en la consola al hacer el POST. |

### Bloque D — DTO, record, servicios y repositorios

| # | Pregunta | Estado | Evidencia / qué falta |
|---|---|---|---|
| P41 | No exponer @Entity | ✅ | `…/usuario/infrastructure/adapter/in/web/dto/UsuarioResponse.java` **no** tiene `password`; `UsuarioJpaEntity` sí tiene `passwordHash` (BCrypt `$2a$10$…`, verificado en la BD). Es el ejemplo exacto de la repregunta. |
| P42 | Request vs Response DTO | ✅ | `CrearUsuarioRequest` (lleva `password`, no lleva `id` ni `creadoEn`) vs `UsuarioResponse` (lleva `id`, `estado`, `creadoEn`, no lleva `password`). **Repregunta** (PUT que cambie el id): `ActualizarRolRequest` **no** tiene id; el id va en el path. |
| **P43 CRÍTICA** | record y DTOs | ✅ | `…/rol/infrastructure/adapter/in/web/dto/CrearRolRequest.java`, `RolResponse.java`, `…/usuario/application/command/RegistrarUsuarioCommand.java`, `…/rol/application/demo/RolDemoResponse.java`. **Repregunta** (record como @Entity): no se puede. JPA necesita un constructor sin argumentos, campos no finales para rellenarlos por reflexión y clases no finales para los proxies LAZY; un record es final e inmutable. |
| P44 | Dónde se convierte Entity ↔ DTO | ✅ | Web: `RolResponse.desde(Rol)`. Persistencia: `…/rol/infrastructure/adapter/out/persistence/RolPersistenceMapper.java` y `…/usuario/…/UsuarioPersistenceMapper.java`. Mapeo manual con fronteras claras. |
| **P45 CRÍTICA** | Qué va y qué no va en el Service | ✅ | `…/rol/application/RolService.java`: nombre único **excluyendo el propio** en el PUT; no borrar un rol con usuarios; límite transaccional. `…/usuario/application/UsuarioService.java`: el padre debe existir, email único y codificar la contraseña vía puerto (`…/usuario/domain/CodificadorPassword.java`). **No** hay HTTP ni SQL. **Repregunta** (regla que no va en el Controller): "no borrar un rol con usuarios". También la necesitaría otro adaptador de entrada (CLI, mensajería); en el controller quedaría atada a HTTP. |
| P46 | Puerto propio vs JpaRepository | ✅ | `RolRepository` (puerto) vs `RolJpaRepository` (Spring Data). **Repregunta** (probar sin PostgreSQL): `…/Main.java` + `RolRepositoryEnMemoria`, sin mocks. |
| P47 | findById, Optional, derivadas, @Query | ✅ | `findById` + `Optional` (adapters), `getReferenceById` (`UsuarioPersistenceAdapter`), derivadas `existsByNombreIgnoreCase`, `existsByNombreIgnoreCaseAndIdNot`, `existsByEmailIgnoreCase`, y **`@Query` JPQL** `RolJpaRepository.contarUsuarios`. |

### Bloque E — Validación, pruebas y microservicios

| # | Pregunta | Estado | Evidencia / qué falta |
|---|---|---|---|
| P48 | Tres niveles de validación | ✅ | Bean Validation: `CrearRolRequest`/`CrearUsuarioRequest`. Negocio: `RolService`/`UsuarioService`. BD: `UNIQUE rol_nombre_key`, `usuario_email_key`, FK. **Repregunta (carrera), demostrada:** 8 POST simultáneos con el mismo nombre dieron 1 × 201 + 7 × 409 y 1 sola fila. La resolvió el UNIQUE de PostgreSQL y `GlobalExceptionHandler` mapea `DataIntegrityViolationException` → 409. |
| P49 | Probar Controller, Service y Repository | ❌ **pendiente real** | **No hay ningún test automatizado** (`src/test/java` está vacío). El test de persistencia del cap. 05 fue temporal y se borró. Solo se puede explicar el plan: `@WebMvcTest` para el controller, test unitario de `RolService` con `RolRepositoryEnMemoria` y test de repositorio contra PostgreSQL real. **Repregunta** (error de mappedBy): solo lo detecta un test de repositorio con BD o el arranque del contexto, nunca un unit test del service. |
| **P50 CRÍTICA** | Monolito hexagonal → microservicios | 🟡 | La base existe: módulos `rol`/`usuario` con puertos propios, y `UsuarioService` depende del **puerto** `RolRepository`, no de su implementación. **La repregunta pega en un punto débil real, que ahora es mayor:** `UsuarioPersistenceAdapter` usa `RolJpaRepository`, y las entidades JPA se referencian **en ambas direcciones** (`UsuarioJpaEntity.rol` ⇄ `RolJpaEntity.usuarios`). Hay que reconocerlo: *"estar en paquetes separados no me deja listo para microservicios. Para extraer `usuario`, el rol debería referenciarse solo por id y consultarse por un puerto o API, y las tablas deberían separarse"*. Es una concesión consciente: la bidireccionalidad se agregó para P29/P30. |

---

### Análisis de las tres preguntas que pediste revisar

- **P30:** con lo unidireccional **no alcanzaba**. Se agregó `@OneToMany(mappedBy = "rol", fetch = LAZY)` en `RolJpaEntity`, sin cascade ni orphanRemoval. Ahora ✅.
- **P39 (ddl-auto):** justificación en `notas-capitulo-05.md`. ✅
- **P49 (tests):** **pendiente real y deliberado.** Se decidió no escribir tests todavía. Queda ❌.

---

### Pendientes detectados al cruzar con el banco real

| # | Qué | Estado | Cubre |
|---|---|---|---|
| 1 | `PUT /api/roles/{id}` | ✅ Hecho y probado | **P18**, P36, P42 |
| 2 | `DELETE /api/roles/{id}` (204 / 409 si tiene usuarios) | ✅ Hecho y probado | **P19**, P20, P31 |
| 3 | `@OneToMany(mappedBy = "rol")` en `RolJpaEntity` | ✅ Hecho y probado | **P29, P30**, P47 (`@Query`) |
| 4 | `POST /api/usuarios` + `GET /api/usuarios/{id}` con `UsuarioService` | ✅ Hecho y probado | **P15**, P21, P41 |
| 5 | `@Transactional` en los servicios + `DataIntegrityViolationException` → 409 | ✅ Hecho y probado (carrera real) | **P45**, P23, P48 |
| 6 | Tests (unitario del service, `@WebMvcTest`, repositorio) | ⏸️ **Pendiente por decisión** | P49 |
| 7 | Acceso de `UsuarioPersistenceAdapter` a `RolJpaRepository` | ✖️ **Se mantiene como concesión documentada** (decisión tomada) | P50: se defiende reconociendo el acoplamiento |
| 8 | `spring.jpa.show-sql=true` en `application.properties` (no en un profile: también habría que activarlo a mano) | ✅ Hecho | P11, P40, Desafío 1 |
| 9 | springdoc/Swagger UI | ✖️ Fuera de alcance (no lo pide ninguna guía disponible) | P14 (se responde con teoría) |
| — | CORS | ✖️ Fuera de alcance (no lo pide ninguna guía disponible) | P24 (se responde con teoría) |

**Dependencia nueva:** `spring-security-crypto` (solo BCrypt, sin filtros ni login), para no guardar contraseñas en texto plano en `password_hash`.

## Mapa de archivos tocados

```
backend/pom.xml                                   (+ web, + validation, + spring-security-crypto)
backend/src/main/java/com/agrocontrol/
  Main.java                                       (reescrito: service + memoria + caminos ±)
  shared/application/ProjectInfoService.java
  shared/web/HealthController.java
  shared/web/GlobalExceptionHandler.java          (404, 409, 400, DataIntegrityViolation → 409)
  rol/domain/Rol.java                             (Java puro)
  rol/domain/RolRepository.java                   (puerto: + existePorNombre, existePorNombreEnOtroRol, tieneUsuariosAsignados, eliminar)
  rol/domain/exception/{RolNoEncontrado,NombreRolDuplicado,RolConUsuarios}Exception.java
  rol/application/RolService.java                 (registrar/obtener/listar/actualizar/eliminar, @Transactional)
  rol/application/demo/{RolDemoResponse,RolDemoService}.java
  rol/infrastructure/memory/RolRepositoryEnMemoria.java
  rol/infrastructure/config/RolConfig.java
  rol/infrastructure/adapter/in/web/{RolController,RolDemoController}.java
  rol/infrastructure/adapter/in/web/dto/{CrearRolRequest,ActualizarRolRequest,RolResponse}.java
  rol/infrastructure/adapter/out/persistence/{RolJpaEntity (+@OneToMany),RolJpaRepository (+@Query),RolPersistenceMapper,RolPersistenceAdapter}.java
  usuario/domain/{Usuario,UsuarioRepository,CodificadorPassword}.java
  usuario/domain/exception/{UsuarioNoEncontrado,EmailUsuarioDuplicado}Exception.java
  usuario/application/UsuarioService.java         (@Transactional)
  usuario/application/command/RegistrarUsuarioCommand.java   (passwordHash → password)
  usuario/infrastructure/config/UsuarioConfig.java
  usuario/infrastructure/security/BCryptCodificadorPassword.java
  usuario/infrastructure/adapter/in/web/UsuarioController.java
  usuario/infrastructure/adapter/in/web/dto/{CrearUsuarioRequest,UsuarioResponse}.java
  usuario/infrastructure/adapter/out/persistence/{UsuarioJpaEntity,UsuarioJpaRepository,UsuarioPersistenceMapper,UsuarioPersistenceAdapter}.java
  (eliminados: rol/infra/*, usuario/infra/*)
backend/src/main/resources/db/migration/V2__seed_core.sql
backend/src/main/resources/db/queries/class08_joins.sql
docs/05-database/clase07-consultas.sql
docs/06-defensa/*.md
requests.http
```
