# Notas de defensa — Capítulo 03: Spring Boot base

> Guía fuente: `Capitulo_03_Guia_Estudiante_Introduccion_SpringBoot_Primer_Backend_Proyecto_Asignado.pdf`

## Ficha

| Dato | AgroControl |
|---|---|
| Sistema | AgroControl |
| Backend | `backend/` (artifactId `AgroControl`) |
| Package base | `com.agrocontrol` |
| Entidad padre 1:N | `Rol` |
| Entidad dependiente | `Usuario` |
| Relación | 1 rol tiene muchos usuarios |

## Qué se implementó y dónde

| Pieza | Archivo |
|---|---|
| Dependencia web (Tomcat embebido + Spring MVC + Jackson) | `backend/pom.xml` → `spring-boot-starter-web` |
| Bean de aplicación | `shared/application/ProjectInfoService.java` (`@Service`) |
| Endpoint de salud | `shared/web/HealthController.java` → `GET /api/health` |
| Record de salida del demo | `rol/application/demo/RolDemoResponse.java` (4 campos: id, nombre, descripcion, cantidadUsuarios) |
| Servicio demo | `rol/application/demo/RolDemoService.java` (`@Service`, datos fijos, sin BD) |
| Controller demo | `rol/infrastructure/adapter/in/web/RolDemoController.java` → `GET /api/roles/demo` |
| Pruebas HTTP | `requests.http` (raíz del repo) |

Respuestas reales obtenidas:

```
GET /api/health      -> 200 {"status":"OK","application":"AgroControl","stage":"SPRING_BOOT_BASE","timestamp":"..."}
GET /api/roles/demo  -> 200 {"id":1,"nombre":"JEFE_DE_CAMPO","descripcion":"Planifica campañas...","cantidadUsuarios":3}
```

## Por qué se decidió así

**1. `shared` vs. módulo `rol`.** `/api/health` no pertenece a ningún concepto del negocio, por eso vive en `shared/web`. El demo de roles sí es del negocio, por eso vive en `rol/...`. La guía prohíbe paquetes globales `controller/`, `service/`: el monolito se organiza **por módulo de negocio** y dentro de cada módulo por capa.

**2. Inyección por constructor.** `HealthController` recibe `ProjectInfoService` como parámetro del constructor. Nunca hace `new ProjectInfoService()`. Así:
- el campo puede ser `final` (inmutable, nunca null),
- la dependencia es explícita (se ve en la firma),
- en un test puedo pasar un doble sin levantar Spring.
Con un solo constructor, Spring lo usa automáticamente, no hace falta `@Autowired`.

**3. `RolDemoResponse` es un record.** Datos de salida inmutables; Jackson lo serializa a JSON usando los componentes del record. Tiene `cantidadUsuarios` a propósito: muestra que el response puede traer información que **no** es una columna de la tabla `rol` (sale de la relación 1:N).

**4. Nota de contexto.** La guía del cap. 03 dice "no JPA ni PostgreSQL todavía". Mi proyecto ya tenía JPA+Flyway conectado antes (se adelantó). No se quitó: el demo de este capítulo **igual** no toca la base, y así se ve claramente la diferencia entre el demo (datos fijos) y el CRUD real del cap. 04.

## Flujo que tengo que poder contar sin leer

```
Cliente HTTP (IntelliJ / curl)
  → GET /api/roles/demo
  → Tomcat embebido (puerto 8080)
  → DispatcherServlet de Spring MVC busca el @GetMapping que coincide
  → RolDemoController.demo()
  → RolDemoService.obtenerDemo()   (Bean creado por Spring)
  → devuelve RolDemoResponse (record)
  → Jackson lo convierte a JSON
  → HTTP 200
```

## Conceptos (con mis palabras)

| Concepto | Explicación corta |
|---|---|
| Spring Boot | Spring con configuración automática: detecta lo que hay en el classpath (web, JPA, Flyway) y lo configura; trae Tomcat embebido, así la app se ejecuta con un `main`. |
| Bean | Objeto que crea y administra Spring. Ej.: `ProjectInfoService`, `RolDemoService`, `RolController`. |
| IoC (inversión de control) | Yo no creo los objetos ni decido cuándo; el contenedor de Spring lo hace y me los entrega. |
| DI (inyección de dependencias) | La forma concreta de IoC: Spring le pasa a cada Bean lo que necesita (por constructor). |
| `@SpringBootApplication` | = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`. Escanea `com.agrocontrol` y todos sus subpaquetes. |
| `@RestController` | Controller cuyos métodos devuelven datos (JSON), no vistas HTML. |
| `@Service` | Marca una clase de lógica de aplicación como Bean. |
| `@GetMapping` | Asocia un método a `GET` en una ruta. |

## Qué me van a preguntar

1. **¿Qué hace `@SpringBootApplication`?** Ver tabla. Clave: el component scan parte del paquete de `AgroControlApplication` (`com.agrocontrol`), por eso todo lo que está debajo se detecta.
2. **Un Bean de mi proyecto:** `ProjectInfoService`. Lo crea Spring al arrancar porque tiene `@Service` y está bajo `com.agrocontrol`.
3. **¿Quién crea el DemoService?** El contenedor de Spring (ApplicationContext), no yo.
4. **¿Por qué por constructor?** Ver punto 2.
5. **Camino de la petición:** ver flujo.
6. **¿Por qué todavía sin PostgreSQL?** Para aprender HTTP/Spring aislado. (En mi caso la conexión ya existía; el demo igual no la usa).
7. **Padre/dependiente:** Rol → Usuario.
8. **¿Cómo evoluciona a hexagonal?** El controller es un *adaptador de entrada* (`infrastructure/adapter/in/web`); el servicio es la *aplicación*; el repositorio JPA será el *adaptador de salida* (`infrastructure/adapter/out/persistence`, cap. 05).

## Errores que sé diagnosticar

- 404 → la URL no coincide con `@RequestMapping` + `@GetMapping`.
- "No qualifying bean" → a la clase le falta `@Service`/`@Component` o está fuera de `com.agrocontrol`.
- Puerto 8080 ocupado → hay otra instancia corriendo.
