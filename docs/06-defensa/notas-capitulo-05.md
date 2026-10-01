# Notas de defensa — Capítulo 05: JPA/Hibernate, dominio puro y mapeo

> ⚠️ No tuve el PDF del capítulo 05; esto se armó con el diagnóstico de gaps y con lo que anticipan las guías 02 y 04
> ("La clase Java de dominio NO es todavía una tabla JPA… aparecerán las entidades de persistencia y el mapeo";
> "No expongas tu clase de dominio"). Cuando tengas el PDF, contrastá nombres de clases/paquetes.

## Decisión tomada: opción (a), refactorizar Rol/Usuario

Antes `Rol` y `Usuario` eran **a la vez** dominio y tabla (`@Entity` dentro de `domain/`). Ahora están separados en tres piezas por entidad:

```
rol/
├── domain/Rol.java                          ← Java puro: reglas (nombre obligatorio, agregarUsuario)
└── infrastructure/adapter/out/persistence/
    ├── RolJpaEntity.java                    ← @Entity: cómo es la fila de agrocontrol.rol
    ├── RolJpaRepository.java                ← Spring Data: JpaRepository<RolJpaEntity, Long>
    ├── RolPersistenceMapper.java            ← traduce Rol ⇄ RolJpaEntity
    └── RolPersistenceAdapter.java           ← implements RolRepository (el puerto del dominio)

usuario/
├── domain/Usuario.java                      ← Java puro, con Long rolId
└── infrastructure/adapter/out/persistence/
    ├── UsuarioJpaEntity.java                ← @ManyToOne(fetch = LAZY, optional = false) RolJpaEntity rol
    ├── UsuarioJpaRepository.java
    ├── UsuarioPersistenceMapper.java
    └── UsuarioPersistenceAdapter.java       ← implements UsuarioRepository
```

Se eliminaron `rol/infra/` y `usuario/infra/` (`RolRepositoryImpl`, `UsuarioRepositoryImpl` y sus `JpaRepository`); su función la cumplen ahora los `*PersistenceAdapter`. **No se tocó la base de datos**: mismas tablas, mismas columnas, ninguna migración nueva para esto.

## Por qué separar dominio y entidad JPA

1. **El dominio no depende de la tecnología.** `grep jakarta` en `rol/domain`, `usuario/domain` y `rol/application` da cero resultados. Si mañana se cambia JPA por JDBC, MongoDB o un servicio externo, `Rol`, `Usuario` y `RolService` no cambian.
2. **JPA impone cosas que el dominio no quiere.** Una `@Entity` necesita un constructor vacío, y los campos no pueden ser `final` porque Hibernate los rellena por reflexión. Ahora `Rol` tiene todos sus campos `final` y **no** tiene constructor vacío: no se puede crear un rol sin nombre ni por accidente.
3. **Cada clase cambia por un solo motivo.** `Rol` cambia si cambia una regla de negocio; `RolJpaEntity` cambia si cambia la tabla. Antes una sola clase cargaba con las dos cosas.
4. **Arquitectura hexagonal completa en el par 1:N:**
   - **Puerto de salida**: `RolRepository` / `UsuarioRepository` (interfaces en `domain`).
   - **Adaptador de salida**: `RolPersistenceAdapter` / `UsuarioPersistenceAdapter` (implementan el puerto usando JPA).
   - **Adaptador de entrada**: `RolController` (cap. 04).
   - **Núcleo**: `Rol`, `Usuario`, `RolService`.
   Las dependencias apuntan hacia adentro: infraestructura → dominio, nunca al revés.
5. **Prueba de que funciona:** `Main` usa `RolRepositoryEnMemoria` y Spring usa `RolPersistenceAdapter`; `RolService` es el mismo en ambos casos.

## La relación `@ManyToOne` Usuario → Rol

```java
@ManyToOne(fetch = FetchType.LAZY, optional = false)
@JoinColumn(name = "id_rol", nullable = false)
private RolJpaEntity rol;
```

| Pieza | Qué significa | Con qué parte de la BD se corresponde |
|---|---|---|
| `@ManyToOne` | Muchos usuarios → un rol | FK `usuario_id_rol_fkey` |
| `@JoinColumn(name = "id_rol")` | La columna FK en la tabla `usuario` se llama `id_rol` | columna `usuario.id_rol` |
| `optional = false` / `nullable = false` | Todo usuario tiene rol | `id_rol integer NOT NULL` |
| `fetch = FetchType.LAZY` | Al leer un usuario **no** se trae el rol hasta que se necesite | — (decisión de rendimiento) |

**¿Por qué LAZY?** `@ManyToOne` por defecto es EAGER: cada vez que leo usuarios, Hibernate hace JOIN o un SELECT extra a `rol`. Con una lista de 100 usuarios eso puede ser el famoso problema **N+1** (1 consulta para los usuarios + N para sus roles). Con LAZY, Hibernate pone un *proxy* (un objeto "promesa") y solo va a la BD si le pido algo más que el id.

**¿Por qué el dominio tiene `Long rolId` y la entidad JPA un objeto `RolJpaEntity`?** En la BD la relación es una FK, y para el dominio basta el id: `Usuario` no necesita el objeto `Rol` completo para aplicar sus reglas. El objeto completo es un detalle de Hibernate para poder navegar y armar el JOIN. El mapper hace el puente:
- `toDomain`: `entity.getRol().getId()` → leer el id de un proxy LAZY **no** dispara consulta (Hibernate ya conoce el id: está en la columna `id_rol`).
- `toEntity`: el adapter usa `rolJpaRepository.getReferenceById(rolId)` → crea un proxy **sin** hacer SELECT; al hacer INSERT solo necesita el id para la FK.

## La relación ahora es bidireccional: `@OneToMany(mappedBy = "rol")` en Rol — P29, P30

Al principio la dejé **unidireccional** (solo `@ManyToOne` en Usuario). Técnicamente era válido, pero el banco (P30, CRÍTICA) exige *"decir el nombre exacto de su campo mappedBy"*, y el Desafío 2 pregunta qué pasa si se elimina. Por eso se agregó el lado inverso en `…/rol/infrastructure/adapter/out/persistence/RolJpaEntity.java`:

```java
@OneToMany(mappedBy = "rol", fetch = FetchType.LAZY)
private List<UsuarioJpaEntity> usuarios = new ArrayList<>();
```

| Pieza | Dónde | Qué significa |
|---|---|---|
| **Lado propietario** | `UsuarioJpaEntity.rol` (`@ManyToOne` + `@JoinColumn(name = "id_rol")`) | Es el que **escribe** la FK. Hibernate mira este campo para decidir qué va en `usuario.id_rol`. |
| **Lado inverso** | `RolJpaEntity.usuarios` (`@OneToMany(mappedBy = "rol")`) | Solo **lee**. Modificar esta lista **no** genera SQL. |
| `mappedBy = "rol"` | — | Nombre del **atributo Java** `rol` en `UsuarioJpaEntity`. **No** es la columna `id_rol`. |
| `@JoinColumn(name = "id_rol")` | — | Nombre de la **columna SQL**. Va solo en el lado propietario. |

**Repreguntas probables:**
- *"¿Qué pasa si pongo `mappedBy = "id_rol"`?"* → Hibernate falla **al arrancar** (al construir el EntityManagerFactory) con una `AnnotationException` que dice que `usuarios` está *mappedBy* una propiedad que **no existe** en la entidad destino (el texto exacto varía según la versión de Hibernate). La app ni siquiera levanta.
- *"¿Qué pasa si borro `mappedBy`?"* → Hibernate interpreta que `usuarios` es **otra** relación independiente, con dueño propio, y busca una **tabla intermedia** que no existe (por defecto `rol_usuario`: tabla dueña + `_` + tabla destino). Como el esquema lo maneja Flyway (`ddl-auto=none`), falla en runtime al primer acceso a la colección.
- *"Si solo tuvieras `@ManyToOne`, ¿la relación seguiría existiendo?"* → Sí: la FK está en la tabla `usuario` y la controla el lado propietario. Lo que se pierde es navegar `rol.getUsuarios()` en Java y poder escribir JPQL como `join r.usuarios`.
- **Cardinalidad Java vs relacional:** en la BD solo existe la FK en `usuario` (N→1). En Java la relación se puede ver desde los dos lados, pero **una sola** columna la representa.

**Decisiones sobre el lado inverso:**
- `FetchType.LAZY`, que igual es el default de `@OneToMany`: al leer un rol **no** se traen sus usuarios.
- **Sin `cascade`**: guardar o borrar un rol no debe propagar nada a los usuarios. Por negocio, un usuario no nace ni muere con su rol (P31).
- **Sin `orphanRemoval`**: sacar un usuario de la lista **no** debe borrar a la persona (P32). Con `orphanRemoval = true`, quitarlo de `rol.getUsuarios()` generaría un `DELETE FROM usuario`.
- `getUsuarios()` devuelve una lista **no modificable** y no hay `addUsuario()`: como el lado inverso no escribe la FK, un helper que solo tocara la lista crearía la ilusión de un cambio que nunca llega a la BD. Si en el futuro hiciera falta, el helper tendría que setear **también** `usuario.rol` (P34: sincronizar ambos lados).
- **Nunca se serializa:** `RolResponse` no tiene `usuarios`. Rol→usuarios→rol sería un ciclo infinito para Jackson (P35); el DTO lo evita por diseño, sin `@JsonIgnore`.
- **Dónde se usa:** en la consulta `@Query` de `RolJpaRepository.contarUsuarios` (`join r.usuarios u`), que protege el DELETE. SQL real generado:
  ```
  select count(u1_0.id_usuario) from agrocontrol.rol rje1_0 join agrocontrol.usuario u1_0 on rje1_0.id_rol=u1_0.id_rol where rje1_0.id_rol=?
  ```
  El ON lo arma Hibernate a partir del `mappedBy`.

Verificado: un `PUT /api/roles/3` (OPERARIO, con 2 usuarios) actualiza el rol y los 2 usuarios siguen con `id_rol = 3`. El `merge` de un `RolJpaEntity` con la lista vacía **no** tocó la FK, justamente porque es el lado inverso y no tiene cascade.

## `@Transactional` en `RolService` y `UsuarioService`: una concesión pragmática — P23, P45

**Qué se hizo:** `registrar`, `actualizar` y `eliminar` llevan `@Transactional`; `obtener` y `listar` llevan `@Transactional(readOnly = true)`. `UsuarioService` sigue el mismo criterio.

**La concesión:** hasta ahora `application` era Java puro. Ahora importa `org.springframework.transaction.annotation.Transactional`. Se aceptó a propósito:
- **El límite de la transacción es una decisión de aplicación, no de persistencia.** Solo el caso de uso sabe que "verificar que el nombre no existe + guardar" o "verificar que no tiene usuarios + borrar" son **una sola unidad de trabajo**. El adapter JPA no puede saberlo, porque ve operaciones sueltas.
- **Lo que queda aislado es la persistencia.** `RolService` sigue sin conocer JPA, Hibernate, `EntityManager`, `RolJpaEntity` ni SQL. Depende del puerto `RolRepository`. `@Transactional` es una abstracción de Spring (`PlatformTransactionManager`) que funcionaría igual con JDBC u otra tecnología.
- **No rompe el uso sin Spring.** `Main` sigue creando `new RolService(new RolRepositoryEnMemoria())`. Sin el contenedor nadie interpreta la anotación, que queda inerte.
- **Alternativa más estricta** (para decir que se conoce): dejar el servicio sin anotaciones y declarar la transacción afuera, en un *decorator* o con `TransactionTemplate` en la configuración. Se descartó porque agrega una clase por servicio sin beneficio real en este tamaño de proyecto.

**Cómo funciona:** `RolConfig` registra `RolService` como `@Bean`. Spring detecta `@Transactional` y en su lugar inyecta un **proxy** (una subclase generada con CGLIB). El proxy abre la transacción, llama al método real y hace commit, o **rollback** si sale una `RuntimeException` (todas nuestras excepciones de dominio lo son). Consecuencia: la llamada interna `this.obtener(id)` dentro de `actualizar` **no** pasa por el proxy, pero ya está dentro de la transacción de `actualizar`, así que da igual.

**Evidencia 1: un solo persistence context (P36, P37).** SQL real de `PUT /api/roles/5`:
```
select ... from agrocontrol.rol where id_rol=?                          ← obtener(id): el rol queda MANAGED
select ... where upper(nombre)=upper(?) and id_rol<>? fetch first ? rows only   ← regla: nombre único excluyendo el propio
update agrocontrol.rol set descripcion=?,nombre=? where id_rol=?        ← merge + dirty checking al commit
```
El `save()` de un rol con id hace `merge`. Como el rol ya estaba **managed** en la misma transacción (lo cargó `obtener`), el merge **no** hizo otro SELECT: copió los valores sobre la instancia gestionada y el UPDATE salió al hacer commit.

**Evidencia 2: dirty checking (P36, P18).** Se repitió el mismo PUT con los mismos datos. SQL real: los **dos SELECT y ningún UPDATE**. Hibernate comparó el estado con la foto tomada al cargar, no encontró cambios y no escribió nada. Es la idempotencia del PUT vista en el SQL.

**Evidencia 3: la carrera la resuelve PostgreSQL (P48).** Se lanzaron 8 `POST /api/roles` **simultáneos** con el mismo nombre. Resultado: **1 × 201** y **7 × 409**, con 1 sola fila en la tabla. Los 8 pasaron el `existePorNombre` porque ninguno veía todavía al otro; el `UNIQUE rol_nombre_key` rechazó 7 INSERT. Spring los tradujo a `DataIntegrityViolationException` y `GlobalExceptionHandler` los mapea a 409. Sin ese handler habrían sido 7 × 500. **Conclusión para la defensa:** la validación del servicio da el mensaje claro en el caso normal y la constraint de la BD garantiza la integridad bajo concurrencia. No sobra ninguna de las dos.

## ¿Por qué `ddl-auto=none` y no `validate` (ni `update`)? — P39

Qué hace cada valor, en una línea:
- `create`: borra y crea el esquema al arrancar.
- `create-drop`: igual que `create`, y además lo borra al cerrar.
- `update`: altera tablas para que coincidan con las entidades, pero nunca borra.
- `validate`: compara entidades y tablas, y si no coinciden la app **no arranca**.
- `none`: Hibernate no toca el esquema.

**Por qué `none`:**
1. **Una sola fuente de verdad para el esquema: Flyway.** `V1__esquema_inicial.sql` y `V2__seed_core.sql` están versionados en Git y registrados en `flyway_schema_history`. Cualquiera que clone el repo obtiene **exactamente** el mismo esquema. Si Hibernate también pudiera modificar tablas, habría dos dueños del esquema.
2. **Por qué no `update`:** genera DDL "adivinado" a partir de las entidades, que no queda versionado ni revisado. Nunca borra ni renombra columnas y no migra datos. Con dos desarrolladores con entidades distintas, cada uno termina con un esquema diferente (la repregunta del banco). No es reproducible, así que no sirve para producción.
3. **Por qué todavía no `validate`:** sería el paso ideal, porque con Flyway como dueño del esquema permite fallar al arrancar si el mapeo no coincide con las tablas. Hoy se espera que falle: los ids están mapeados como `Long` (Hibernate espera `bigint`) y las columnas son `integer` en V1. Lo mismo pasa en las 13 entidades no refactorizadas. Para activarlo hay que alinear tipos (ids `Integer` en Java, o una migración `V3` que pase las PK/FK a `bigint`). *(No se ejecutó con `validate` para confirmarlo; es la diferencia de tipos esperable.)*

Respuesta corta para la defensa:
> "El esquema lo controla Flyway con migraciones versionadas; Hibernate no debe tocarlo. Uso `none` porque `update` no es reproducible, y todavía no `validate` porque tengo la diferencia `Long`/`integer` en los ids, que es mi siguiente ajuste."

## Evidencia (log real de Hibernate, test temporal contra BD de prueba)

```
insert into agrocontrol.rol (descripcion,nombre) values (?,?) returning id_rol
insert into agrocontrol.usuario (activo,creado_en,email,nombre,password_hash,id_rol) values (?,?,?,?,?,?) returning id_usuario
>>> RELEER USUARIO
select uje1_0.id_usuario,...,uje1_0.id_rol from agrocontrol.usuario uje1_0 where uje1_0.id_usuario=?
>>> FIN RELEER; rolId=2
Tests run: 1, Failures: 0, Errors: 0
```

Lectura:
- Entre el insert del rol y el del usuario **no** hay `select ... from rol`: `getReferenceById` funcionó.
- Al releer, el `select` es **solo** sobre `usuario` (sin JOIN a `rol`) y aun así obtuvimos `rolId=2`: LAZY funcionó y leer el id del proxy no disparó consulta.

(Ese test se borró después porque necesita PostgreSQL levantado y rompería `mvn test` en una máquina sin BD.)

## Otros detalles que me pueden preguntar

- **`@GeneratedValue(strategy = IDENTITY)`**: el id lo genera PostgreSQL (la secuencia `rol_id_rol_seq` como DEFAULT de la columna). Por eso el INSERT no lleva `id_rol` y usa `returning id_rol`.
- **`spring.jpa.hibernate.ddl-auto=none`**: Hibernate **no** crea ni modifica tablas; el esquema lo maneja **solo Flyway**. Las anotaciones `@Column(length=…, nullable=…)` documentan la tabla, no la crean.
- **`spring.jpa.open-in-view=false`**: la sesión de Hibernate no queda abierta durante toda la petición HTTP. Por eso el mapeo a dominio se hace **dentro** del adapter: después de salir no se puede navegar a relaciones LAZY no cargadas (daría `LazyInitializationException`).
- **Constructor "reconstituir" en `Usuario`**: el de 7 parámetros (con `activo` y `creadoEn`) lo usa el mapper para rearmar un usuario que ya existe en la BD. El de 5 es para crear uno nuevo (nace activo y con `creadoEn = ahora`). Los dos validan igual.
- **Mappers como clases `final` con métodos `static`**: no tienen estado, así que no necesitan ser Beans; son funciones puras de traducción.

## Lo que quedó sin refactorizar (y cómo defenderlo)

Las otras 13 entidades (`Predio`, `Parcela`, `Cultivo`, `Campana`, `Labor`, `AsignacionLabor`, `BitacoraCampo`, `Insumo`, `MovimientoInsumo`, `ConsumoLabor`, `Cosecha`, `Incidencia`, `Auditoria`) **siguen** siendo `@Entity` dentro de `domain/` y usan FKs como `Long` plano.

> "El curso trabaja el patrón completo sobre mi par 1:N asignado, Rol → Usuario, y ahí está aplicado de punta a punta: dominio puro, entidad JPA, mapper, adapter, @ManyToOne LAZY. Las demás entidades son andamiaje del modelo físico, ninguna tiene repositorio, servicio ni endpoint todavía. Cuando un módulo tenga casos de uso, se le aplica el mismo refactor; es mecánico y ya está el ejemplo."

Otro detalle honesto: la BD usa `integer` para los ids y Java usa `Long`. Funciona (el driver convierte), pero con `ddl-auto=validate` Hibernate lo marcaría como diferencia de tipos (`bigint` vs `integer`).

## Qué me van a preguntar

1. ¿Qué diferencia hay entre `Rol` y `RolJpaEntity`? → Regla de negocio vs. forma de la fila.
2. ¿Qué hace el mapper y por qué existe? → Traduce entre los dos mundos para que ninguno conozca al otro.
3. ¿Qué es un adapter y qué puerto implementa? → `RolPersistenceAdapter implements RolRepository`.
4. ¿Qué significa `@JoinColumn(name = "id_rol")`? → Nombre de la columna FK en `usuario`.
5. ¿Por qué LAZY? ¿Qué es N+1? → Ver arriba.
6. ¿Qué pasa si accedo a `usuario.getRol().getNombre()` fuera de una transacción? → `LazyInitializationException`, porque el proxy necesita ir a la BD y la sesión ya se cerró (`open-in-view=false`). Por eso mapeo dentro del adapter y solo uso el id.
7. ¿Quién crea las tablas? → Flyway (`V1__esquema_inicial.sql`); Hibernate no (`ddl-auto=none`).
8. ¿Qué cambió en la BD con este refactor? → Nada.
