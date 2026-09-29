# Notas de defensa — Capítulo 02: contratos, colecciones, Optional y excepciones

> Guía fuente: `Capitulo_02_Guia_Estudiante_Java21_Interfaces_Colecciones_Optional_Excepciones_Proyecto_Asignado.pdf`

## Mi par 1:N

| Elemento | AgroControl |
|---|---|
| Entidad padre | `Rol` (tabla `agrocontrol.rol`) |
| PK del padre | `id_rol` |
| Entidad dependiente | `Usuario` (tabla `agrocontrol.usuario`) |
| FK hacia el padre | `usuario.id_rol → rol.id_rol` (`usuario_id_rol_fkey`) |
| Cardinalidad | 1:N — un rol lo tienen muchos usuarios; cada usuario tiene exactamente un rol (`id_rol NOT NULL`) |
| Atributo UNIQUE | `rol.nombre` (`rol_nombre_key`) |
| Estado | `usuario.activo` (boolean) → enum `EstadoUsuario { ACTIVO, INACTIVO }` |

## Qué se implementó y dónde

| Pieza | Archivo | Para qué |
|---|---|---|
| Contrato (puerto) | `backend/src/main/java/com/agrocontrol/rol/domain/RolRepository.java` | Se agregó `existePorNombre(String)`. Ahora el contrato expresa la regla UNIQUE sin hablar de SQL. |
| Implementación en memoria | `rol/infrastructure/memory/RolRepositoryEnMemoria.java` | `LinkedHashMap<Long, Rol>` + `AtomicLong` como secuencia. |
| Implementación JPA (ya existía) | `rol/infra/RolRepositoryImpl.java` + `RolJpaRepository.java` | Se agregó `existsByNombreIgnoreCase`, un *query method* derivado: Spring Data genera el SQL a partir del nombre. |
| Servicio Java puro | `rol/application/RolService.java` | `registrar`, `obtener`, `listar`. En este capítulo, sin anotaciones de Spring. *(Luego se agregaron `actualizar`/`eliminar` y `@Transactional`: ver notas 04 y 05.)* |
| Excepción "no existe" | `rol/domain/exception/RolNoEncontradoException.java` | Se lanza desde `obtener(id)` vía `Optional.orElseThrow`. |
| Excepción "duplicado" | `rol/domain/exception/NombreRolDuplicadoException.java` | Se lanza desde `registrar` si el nombre ya existe. |
| Enum (ya existía) | `usuario/domain/EstadoUsuario.java` | Estados cerrados del usuario. |
| Record | `usuario/application/command/RegistrarUsuarioCommand.java` | Datos de entrada de la operación "registrar usuario". |
| Prueba | `com/agrocontrol/Main.java` | Camino positivo (5 roles, 6 usuarios, listar, obtener) y dos negativos. |

Salida real de `Main`:

```
Roles registrados: 5
Rol 1: ADMINISTRADOR (1 usuarios)
...
obtener(3) -> OPERARIO
ERROR CONTROLADO: No existe el rol con id: 999
ERROR CONTROLADO: Ya existe un rol con el nombre: operario
```

## Por qué se decidió así

**1. El servicio depende de la interfaz, no de la implementación.**
`private final RolRepository repository;` y no `RolRepositoryEnMemoria` ni `RolRepositoryImpl`. La guía lo marca como "error prohibido". La prueba de que funciona es que **el mismo `RolService` sin cambiar una línea** funciona con dos implementaciones: `Main` le pasa la de memoria, y Spring (en el cap. 04) le pasará la de JPA/PostgreSQL. Eso es inversión de dependencias: el núcleo define el contrato y la infraestructura lo cumple.

**2. ¿Por qué `Map` (y `LinkedHashMap` en particular)?**
- `Map` porque la operación más frecuente es buscar por id: `datos.get(id)` es directo, no hay que recorrer. Simula la PK.
- `LinkedHashMap` y no `HashMap` porque conserva el orden de inserción, así `listarTodos()` devuelve los roles en el orden en que se registraron (determinista, como un `ORDER BY id`).
- No `Set`, porque la unicidad que me importa no es la del objeto entero sino la del **nombre**, y eso lo verifico explícitamente con `existePorNombre`.
- `listarTodos()` devuelve `new ArrayList<>(datos.values())`: una **copia**, para que quien la reciba no pueda modificar el almacenamiento interno.

**3. ¿Por qué `AtomicLong`?** Simula el `SERIAL`/secuencia de PostgreSQL (`rol_id_rol_seq`). Si llega un `Rol` con id `null`, el repositorio le asigna el siguiente. `accumulateAndGet(id, Math::max)` evita colisiones si alguien guarda un rol con id explícito.

**4. Optional.** `buscarPorId` puede no encontrar. En lugar de devolver `null` (y arriesgar un `NullPointerException` lejos del origen), el tipo `Optional<Rol>` **obliga** a quien llama a decidir qué hacer. En el servicio decidimos: `orElseThrow(() -> new RolNoEncontradoException(id))`.

**5. Excepciones propias vs. `IllegalArgumentException`.**
- Las propias (`RolNoEncontradoException`, `NombreRolDuplicadoException`) representan **reglas de negocio**: "ese rol no existe", "ese nombre ya está tomado". Tienen nombre del dominio, así que al leer un log sabés qué pasó sin leer el mensaje. En el cap. 04 se pueden mapear a HTTP 404 y 409.
- Las `IllegalArgumentException` de los constructores de `Rol`/`Usuario` **se mantuvieron a propósito**: protegen invariantes del objeto (nombre vacío, email sin @). Son el equivalente Java de `NOT NULL`/`CHECK`: un error de programación o de datos, no una regla de negocio.
- Extienden `RuntimeException` (no chequeadas) para no ensuciar todas las firmas con `throws`; el que quiera tratarlas las captura.

**6. Duplicado ignorando mayúsculas.** `existePorNombre("operario")` detecta `OPERARIO`. En la base el `UNIQUE` distingue mayúsculas, pero para el negocio "Operario" y "OPERARIO" son el mismo rol. La regla de la aplicación es **más estricta** que la de la BD; la BD queda como última red de seguridad.

**7. El record `RegistrarUsuarioCommand`.** Tiene solo `rolId, nombreCompleto, email, password`: lo que necesita la operación. *(Actualización: el componente se llamaba `passwordHash`; se renombró a `password` cuando se agregó `UsuarioService`, porque el command trae la contraseña en texto plano y es el servicio quien la codifica con BCrypt. Un nombre que miente sobre el contenido es un bug esperando a ocurrir.)* **No** tiene `id` (lo genera el sistema), ni `activo` (todo usuario nace activo), ni `creadoEn` (lo pone el sistema). Un record es inmutable y genera constructor, getters (`cmd.email()`), `equals`, `hashCode` y `toString`: ideal para "paquetes de datos" que viajan de una capa a otra.

**8. Dónde vive la relación 1:N en Java.** En `Usuario` el campo `rolId` (la FK), y en `Rol` la lista `usuarios` (`@Transient`, solo en memoria) con `agregarUsuario(...)`. `getUsuarios()` devuelve `Collections.unmodifiableList` para que nadie agregue usuarios saltándose `agregarUsuario` (que valida no nulo).

**9. Dato curioso para la defensa:** `Main` corre con `java -cp target/classes com.agrocontrol.Main`, **sin** Spring ni JPA en el classpath, aunque `Rol` tenga `@Entity`. La JVM ignora anotaciones cuya clase no encuentra en tiempo de ejecución. Pero esto también muestra el problema que se corrige en el cap. 05: el dominio *conoce* JPA en compilación.

## Qué me van a preguntar (guía, preguntas 7–16)

- **¿Padre y dependiente?** Rol (padre) → Usuario (dependiente).
- **¿Dónde está materializado el 1:N?** `Usuario.rolId` (FK) y `Rol.usuarios` + `agregarUsuario`.
- **¿Qué interfaz creaste y qué contrato representa?** `RolRepository`: guardar, buscar por id, listar, verificar nombre único. "Qué" se puede hacer con los roles, no "cómo" se guardan.
- **¿Por qué el servicio depende de la interfaz?** Para poder cambiar memoria → PostgreSQL sin tocar el servicio. Demostrado: `Main` usa memoria, Spring usará JPA.
- **¿Por qué Map/List/Set?** Ver punto 2.
- **¿Qué búsqueda devuelve Optional?** `buscarPorId`, porque el id puede no existir.
- **¿Qué dispara cada excepción?** `obtener(999)` → `RolNoEncontradoException`; `registrar("operario")` con OPERARIO existente → `NombreRolDuplicadoException`.
- **¿Qué enum y qué error evita?** `EstadoUsuario`: impide estados inventados como `"activo "` o `"BORRADO"`; solo existen ACTIVO/INACTIVO, que corresponde al boolean `activo` de la tabla.
- **¿Para qué el record?** Ver punto 7.
- **¿Qué cambia al pasar de memoria a PostgreSQL?** Solo qué implementación de `RolRepository` se inyecta. `RolService`, las excepciones y el dominio no cambian.

## Cosas que puedo reconocer si me las marcan

- `RolRepository` está en `rol/domain/` y no en `rol/domain/port/` como sugiere el árbol de la guía: es el mismo rol (puerto de salida), se dejó donde ya estaba para no mover archivos sin necesidad.
- En este punto conviven `rol/infra` (JPA, código previo) y `rol/infrastructure` (nuevo, nombre de la guía). Se unifica en el cap. 05.
