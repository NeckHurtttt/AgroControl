# Notas de defensa — Capítulo 04: Spring MVC, DTO y validación

> Guía fuente: `Capitulo_04_Guia_Estudiante_SpringMVC_DTO_Validacion_Proyecto_Asignado.pdf`

## Qué se implementó y dónde

| Pieza | Archivo |
|---|---|
| Dependencia de validación (Hibernate Validator) | `backend/pom.xml` → `spring-boot-starter-validation` |
| Request DTO | `rol/infrastructure/adapter/in/web/dto/CrearRolRequest.java` |
| Response DTO | `rol/infrastructure/adapter/in/web/dto/RolResponse.java` |
| Controller (adaptador de entrada) | `rol/infrastructure/adapter/in/web/RolController.java` |
| Registro del servicio como Bean | `rol/infrastructure/config/RolConfig.java` |
| Traducción excepción → HTTP | `shared/web/GlobalExceptionHandler.java` |
| Pruebas | `requests.http` (raíz del repo) |

## Contrato HTTP

| Verbo | Ruta | Entrada | Salida | Status |
|---|---|---|---|---|
| POST | `/api/roles` | JSON `CrearRolRequest` | `RolResponse` | 201 / 400 / 409 |
| GET | `/api/roles` | query param opcional `?nombre=` | lista de `RolResponse` | 200 |
| GET | `/api/roles/{id}` | path variable `id` | `RolResponse` | 200 / 404 |

## Evidencia (ejecución real contra PostgreSQL)

```
POST {"nombre":"AUDITOR",...}        -> 201 {"id":1,"nombre":"AUDITOR",...}
POST {"nombre":""}                   -> 400 errores.nombre = "El nombre del rol es obligatorio"
POST {"nombre":"jefe de campo"}      -> 400 errores.nombre = "...MAYÚSCULAS y usar _..."
POST {"nombre":"AUDITOR"} (repetido) -> 409 "Ya existe un rol con el nombre: AUDITOR"
GET  /api/roles                      -> 200 [ ... ]
GET  /api/roles?nombre=aud           -> 200 [ AUDITOR ]
GET  /api/roles/1                    -> 200
GET  /api/roles/999                  -> 404 "No existe el rol con id: 999"
```

## Por qué se decidió así

**1. URL base `/api/roles`.** Sustantivo en plural (el recurso es la colección de roles); `/api` separa la API de cualquier otra ruta. El verbo lo pone HTTP (POST crea, GET lee), no la URL (nada de `/crearRol`).

**2. Request ≠ Response.**
- `CrearRolRequest(nombre, descripcion)`: **no** tiene `id`, porque lo genera PostgreSQL (secuencia). Si el cliente pudiera mandarlo, podría pisar otro rol.
- `RolResponse(id, nombre, descripcion)`: **sí** tiene `id`, porque el cliente lo necesita para después pedir `/api/roles/{id}`.
- Y la clase de dominio `Rol` **nunca** sale por HTTP: si mañana agrego un campo interno a `Rol`, no se filtra a la API. El DTO es el contrato público; el dominio puede cambiar sin romper a los clientes.
- `RolResponse.desde(rol)` es un método de fábrica: el mapeo dominio → DTO queda en un solo lugar.

**3. Validaciones elegidas y qué protege cada una.**
| Anotación | Campo | Regla que protege |
|---|---|---|
| `@NotBlank` | nombre | `rol.nombre NOT NULL`: un rol sin nombre no tiene sentido. |
| `@Size(max = 50)` | nombre | `varchar(50)` de la tabla: evita que PostgreSQL rechace con error 500. |
| `@Pattern("^[A-Z_]+$")` | nombre | Convención del dominio: los roles son códigos (`JEFE_DE_CAMPO`), no texto libre. Es mi "formato inválido". |
| `@Size(max = 200)` | descripcion | `varchar(200)`; es opcional (la columna admite NULL), por eso no lleva `@NotBlank`. |

Idea clave: **validar en la entrada lo que la base de datos rechazaría igual**, pero con un 400 y un mensaje claro en vez de un 500.

**4. ¿Por qué POST responde 201?** 201 Created significa "se creó un recurso nuevo". 200 solo dice "salió bien". La guía pide explícitamente no poner 200 para todo.

**5. 404 y 409 con `@RestControllerAdvice`.**
El controller no tiene `try/catch`: llama a `service.obtener(id)`, y si el servicio lanza `RolNoEncontradoException`, `GlobalExceptionHandler` la traduce a 404. `NombreRolDuplicadoException` → 409 Conflict (el recurso choca con uno existente). Errores de `@Valid` → 400 con un mapa `errores` campo → mensaje.
Ventajas: el controller queda delgado, la regla "excepción X = status Y" está en un solo lugar, y el dominio sigue sin saber nada de HTTP. `ProblemDetail` es el formato estándar de errores HTTP (RFC 7807) que ya trae Spring 6.

**6. `RolService` no es un `@Service`.** Se registra con un `@Bean` en `RolConfig`. Spring busca un Bean que implemente `RolRepository` y encuentra `RolPersistenceAdapter` (JPA, cap. 05). Así `application` no depende del escaneo de componentes ni de JPA, y `Main` lo sigue usando con el repositorio en memoria. *(Actualización: después se le agregó `@Transactional`, la única dependencia de Spring en `application`, como concesión pragmática; ver `notas-capitulo-05.md`.)* **Es la respuesta práctica a "qué cambia de memoria a PostgreSQL": solo qué implementación se inyecta.**

**7. Diferencia con la guía.** La guía pide un servicio "temporal en memoria" en este capítulo porque todavía no hay BD. En mi proyecto la conexión ya existía, así que el controller usa la base real. Consecuencia: **los datos no se pierden al reiniciar** (pregunta 7 de la guía): con memoria se perderían; con PostgreSQL persisten.

**8. El filtro `?nombre=`.** `@RequestParam(required = false)`: si no viene, lista todo; si viene, filtra por "contiene" sin distinguir mayúsculas. Es opcional porque listar sin filtro es el caso normal.

## Anotaciones con mis palabras

| Anotación | Qué hace |
|---|---|
| `@RestController` | Clase que atiende HTTP y devuelve JSON. |
| `@RequestMapping("/api/roles")` | Prefijo común de todas las rutas de la clase. |
| `@PostMapping` / `@GetMapping` | Qué método HTTP + ruta dispara cada método Java. |
| `@RequestBody` | "Convertí el JSON del cuerpo en este objeto" (Jackson → `CrearRolRequest`). |
| `@Valid` | "Antes de entrar al método, aplicá las anotaciones de validación del objeto"; si falla → 400 sin ejecutar el método. |
| `@PathVariable` | Toma un valor **de la ruta** (`/api/roles/5` → `id = 5`). Identifica **un** recurso. |
| `@RequestParam` | Toma un valor **del query string** (`?nombre=aud`). Modifica/filtra la consulta; suele ser opcional. |

## Qué me van a preguntar

1. **¿Por qué Rol como padre?** Porque `usuario.id_rol` es FK NOT NULL hacia `rol`: el rol existe primero y el usuario depende de él.
2. **URL base:** punto 1.
3. **Request vs Response:** punto 2 (el `id` sale pero no entra).
4. **Validaciones:** tabla del punto 3.
5. **PathVariable vs RequestParam:** tabla de anotaciones.
6. **¿Por qué 201?** Punto 4.
7. **¿Qué pasa con los datos si reinicio?** Punto 7.
8. **¿Dónde está el adaptador de entrada?** `rol/infrastructure/adapter/in/web/RolController.java`.

---

# Ampliación tras el banco de 50 preguntas: PUT, DELETE y POST de la entidad hija

> Agregado para cubrir las CRÍTICAS P15, P18 y P19. Todo probado contra PostgreSQL, con el SQL real de Hibernate.

## Contrato HTTP completo

| Verbo | Ruta | Entrada | Salida | Status |
|---|---|---|---|---|
| POST | `/api/roles` | `CrearRolRequest` | `RolResponse` | 201 / 400 / 409 |
| GET | `/api/roles` | `?nombre=` opcional | lista `RolResponse` | 200 |
| GET | `/api/roles/{id}` | path | `RolResponse` | 200 / 404 |
| **PUT** | `/api/roles/{id}` | path + `ActualizarRolRequest` | `RolResponse` | 200 / 400 / 404 / 409 |
| **DELETE** | `/api/roles/{id}` | path | — | **204** / 404 / 409 |
| **POST** | `/api/usuarios` | `CrearUsuarioRequest` | `UsuarioResponse` | 201 / 400 / **404 (rol padre)** / 409 |
| **GET** | `/api/usuarios/{id}` | path | `UsuarioResponse` | 200 / 404 |

Resultados reales:
```
PUT    /api/roles/5  {SUPERVISOR_GENERAL}   -> 200
PUT    /api/roles/5  (mismo body otra vez)  -> 200, mismo resultado (sin UPDATE en el SQL: verificado repitiendo un PUT idéntico sobre el rol 3)
PUT    /api/roles/5  {OPERARIO}             -> 409 "Ya existe un rol con el nombre: OPERARIO"
PUT    /api/roles/999                       -> 404 (no crea nada)
PUT    /api/roles/5  {"mal formato"}        -> 400
DELETE /api/roles/3  (OPERARIO, 2 usuarios) -> 409 "No se puede eliminar el rol 3 porque tiene usuarios asignados"
DELETE /api/roles/5  (sin usuarios)         -> 204
DELETE /api/roles/5  (otra vez)             -> 404
POST   /api/usuarios {rolId: 3, ...}        -> 201 (sin password en la respuesta)
POST   /api/usuarios {rolId: 999, ...}      -> 404 "No existe el rol con id: 999"
POST   /api/usuarios {email en MAYÚSCULAS ya existente} -> 409
POST   /api/usuarios {vacío, email inválido, pass corta} -> 400 con los 3 errores por campo
GET    /api/usuarios/6 -> 200 · /999 -> 404
```

## PUT — P18 (CRÍTICA)

**Archivos:** `…/rol/infrastructure/adapter/in/web/RolController.java` (`actualizar`), `…/rol/infrastructure/adapter/in/web/dto/ActualizarRolRequest.java`, `…/rol/application/RolService.java` (`actualizar`).

**Flujo, paso a paso:**
1. `@PutMapping("/{id}")`: el `id` sale del **path** (`@PathVariable`) y el nuevo estado del **body** (`@RequestBody`). El id **no** va en el body: es la identidad del recurso y el cliente no puede cambiarlo (P42).
2. `@Valid ActualizarRolRequest`: mismas reglas de formato que el alta; si fallan → 400 y el servicio ni se entera.
3. `RolService.actualizar` (`@Transactional`):
   - `obtener(id)`: si no existe → `RolNoEncontradoException` → **404**. **Nunca** crea el recurso. Si hiciéramos `new Rol(999, ...)` + `save()` sin verificar, Spring Data haría `merge` de un id inexistente y con IDENTITY terminaría insertando un rol **nuevo con otro id**, o fallando. En ambos casos el cliente pidió 999 y obtiene otra cosa (repregunta de P18).
   - `existePorNombreEnOtroRol(nombre, id)`: el nombre debe ser único **excluyendo al propio rol**. Si no lo excluyera, renombrar OPERARIO a OPERARIO (o solo cambiarle la descripción) daría 409 contra sí mismo. Consulta derivada: `existsByNombreIgnoreCaseAndIdNot` → `... and id_rol <> ?`.
   - `guardar(new Rol(id, nombre, descripcion))`: el dominio es inmutable (campos `final`), así que se construye el nuevo estado completo con el **mismo id**.
4. En el adapter, `save()` recibe una entidad con id, así que hace **merge**. El rol ya estaba *managed* (lo cargó `obtener` en la misma transacción), por lo que no hay otro SELECT. Al commit, el **dirty checking** compara con la foto original y emite `update agrocontrol.rol set descripcion=?,nombre=? where id_rol=?`.
5. Se responde 200 con el `RolResponse` actualizado.

**Idempotencia, demostrada:** el mismo PUT dos veces deja el mismo estado final. En el segundo, Hibernate **no emitió UPDATE** (solo los dos SELECT), porque no había cambios.

**PUT vs PATCH:** PUT reemplaza el estado completo del recurso: si omito `descripcion`, queda `null`. PATCH aplicaría solo los campos enviados. Por eso `ActualizarRolRequest` pide la representación completa.

## DELETE — P19 (CRÍTICA)

**Archivos:** `RolController.eliminar`, `RolService.eliminar`, `…/rol/domain/exception/RolConUsuariosException.java`, `RolJpaRepository.contarUsuarios` (`@Query`).

**Flujo:**
1. `@DeleteMapping("/{id}")` + `@PathVariable`.
2. `RolService.eliminar` (`@Transactional`):
   - `obtener(id)` → 404 si no existe. Por eso un DELETE repetido da 404; el **estado final** es igual (el rol no existe), o sea que sigue siendo idempotente en efecto.
   - `tieneUsuariosAsignados(id)` → `select count(u) ... join r.usuarios ...`. Si hay usuarios → `RolConUsuariosException` → **409**.
   - `eliminar(id)` → `deleteById` → `delete from agrocontrol.rol where id_rol=?`.
3. `ResponseEntity.noContent()` → **204**, sin body: no hay nada que devolver de un recurso que ya no existe.

**¿Qué pasa con los hijos? (la parte central de la pregunta)**
- En la BD, `usuario_id_rol_fkey` **no** tiene `ON DELETE CASCADE`. PostgreSQL **rechaza** borrar un rol con usuarios.
- En JPA, el `@OneToMany(mappedBy = "rol")` **no** tiene `cascade` ni `orphanRemoval`, así que Hibernate no intenta borrar usuarios.
- **Decisión de negocio:** un rol con usuarios **no se borra**. Primero hay que reasignarlos. El servicio lo verifica **antes** para devolver un 409 con un mensaje claro, en lugar de dejar que la FK explote como error genérico.
- **Repregunta: "¿por qué no poner `CascadeType.ALL` y listo?"** Porque `ALL` incluye `REMOVE`: borrar el rol OPERARIO borraría a Luis y a Ana, que son personas, con su historial de labores, cosechas y bitácora (y además fallaría por las FK de esas tablas). Cascade se decide por el **ciclo de vida de negocio**, no para callar un error de FK.
- Si igual ocurriera una carrera (alguien asigna un usuario entre el chequeo y el DELETE), la FK lo rechaza y `GlobalExceptionHandler` convierte la `DataIntegrityViolationException` en **409**.

## POST de la entidad hija (Usuario) — P15 (CRÍTICA)

**Archivos:**
- `…/usuario/infrastructure/adapter/in/web/UsuarioController.java`
- `…/usuario/infrastructure/adapter/in/web/dto/CrearUsuarioRequest.java`
- `…/usuario/infrastructure/adapter/in/web/dto/UsuarioResponse.java`
- `…/usuario/application/UsuarioService.java`
- `…/usuario/application/command/RegistrarUsuarioCommand.java`
- `…/usuario/infrastructure/adapter/out/persistence/UsuarioPersistenceAdapter.java`

**Línea por línea:**
1. `@PostMapping` en `/api/usuarios`. Jackson convierte el JSON en `CrearUsuarioRequest` al resolver `@RequestBody`.
2. `@Valid`: `@NotNull @Positive rolId`, `@NotBlank @Size(100) nombreCompleto`, `@NotBlank @Email @Size(150) email`, `@NotBlank @Size(8..72) password` (72 es el límite de bytes de BCrypt). Si algo falla → 400 con todos los errores por campo.
3. El controller arma un `RegistrarUsuarioCommand` (record del cap. 02). El servicio **no** conoce el DTO HTTP.
4. `UsuarioService.registrar` (`@Transactional`):
   - **¿Existe el padre?** `rolRepository.buscarPorId(rolId)`. Si no existe → `RolNoEncontradoException` → **404**. Esta es la repregunta de P15: *se detecta en el servicio, antes del INSERT*. Sin esta verificación, PostgreSQL rechazaría la FK y el cliente recibiría un error genérico. (Otra postura válida es **422**, porque el recurso pedido es `/api/usuarios` y lo inválido es un dato del body. Elegí 404 porque la causa es literalmente "no existe el rol X" y reutiliza la misma excepción.)
   - **¿Email único?** `existePorEmail`, sin distinguir mayúsculas → **409**. Es la repregunta de P21: *"un correo con formato correcto pero ya registrado"* es regla de negocio, no de `@Email`.
   - **Password:** se codifica con BCrypt a través del puerto `…/usuario/domain/CodificadorPassword.java`, implementado en `…/usuario/infrastructure/security/BCryptCodificadorPassword.java` (dependencia `spring-security-crypto`: solo el algoritmo, sin filtros ni login). En la BD queda `$2a$10$…`, nunca el texto plano.
   - Se construye el `Usuario` de dominio: nace `activo = true` con `creadoEn = ahora`.
5. `UsuarioPersistenceAdapter.guardar`: **aquí se asigna el padre en el ManyToOne**. `rolJpaRepository.getReferenceById(rolId)` devuelve un **proxy** del rol, sin SELECT; el mapper lo pone en `UsuarioJpaEntity.rol`; `save()` sobre una entidad **sin id** hace `persist`, un **INSERT nuevo** (no merge). Hibernate toma el id del proxy para llenar la columna `id_rol`.
6. SQL real:
   ```
   select ... from agrocontrol.rol where id_rol=?                          ← verificación del padre
   select id_usuario from agrocontrol.usuario where upper(email)=upper(?) ← email único
   insert into agrocontrol.usuario (activo,creado_en,email,nombre,password_hash,id_rol) values (...) returning id_usuario
   ```
   Con `IDENTITY`, el id existe **después** del INSERT (`returning id_usuario`).
7. Se mapea a `UsuarioResponse` y se responde **201**.

**Persistir nuevo vs actualizar gestionado (la otra parte de P15):** en el POST, la entidad llega **sin id**, está *transient* y `save()` hace `persist` (INSERT). En el PUT, el rol llega **con id**, así que `save()` hace `merge` y, como ya estaba *managed*, el UPDATE lo produce el dirty checking al commit.

**`UsuarioResponse` no tiene `password` (P41):** el hash **nunca** sale de la API. Es el ejemplo concreto de "un campo de la entidad que no debe viajar en la respuesta".
