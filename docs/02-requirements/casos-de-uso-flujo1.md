# Casos de uso del primer flujo — criterios de aceptación (Given-When-Then)

Flujo del corte: **campaña → labor → consumo de insumo → ejecución → cosecha**.
Cada criterio se puede comprobar contra la API (`requests.http`), la web o la app móvil.

## CU-01 Crear campaña sobre una parcela (RF-03, RN-01)
**Actor:** Jefe de campo.

- **Escenario 1: creación válida.**
  Dado que la parcela existe y no tiene campañas abiertas, y el cultivo existe,
  cuando el jefe de campo crea una campaña con fecha de inicio,
  entonces la API responde **201** y la campaña queda en estado **PLANIFICADA**.
- **Escenario 2: campaña superpuesta.**
  Dado que la parcela ya tiene una campaña PLANIFICADA o EN_CURSO,
  cuando se intenta crear otra campaña sobre esa parcela,
  entonces la API responde **409** con el mensaje "La parcela … ya tiene una campaña sin finalizar".
- **Escenario 3: parcela inexistente.**
  Dado un id de parcela que no existe,
  cuando se crea la campaña,
  entonces la API responde **404**.

## CU-02 Planificar labor (RF-04, RN-02)
**Actor:** Jefe de campo.

- **Escenario 1: labor válida.**
  Dado una campaña no finalizada,
  cuando el jefe planifica una labor con tipo y fecha,
  entonces la API responde **201**, la labor queda **PLANIFICADA** y hereda la parcela de la campaña.
- **Escenario 2: campaña finalizada.**
  Dado una campaña FINALIZADA,
  cuando se planifica una labor en ella,
  entonces la API responde **409** "No se pueden planificar labores en una campaña finalizada".
- **Escenario 3: datos incompletos.**
  Dado una petición sin tipo o sin fecha,
  cuando se envía,
  entonces la API responde **400** con el error por campo.

## CU-03 Registrar entrada de insumo al almacén (RF-10, RN-07)
**Actor:** Almacenero.

- **Escenario 1: entrada.**
  Dado un insumo con stock 100 kg,
  cuando el almacenero registra una ENTRADA de 50 kg,
  entonces la API responde **201** y el stock pasa a 150 kg.
- **Escenario 2: cantidad inválida.**
  Dado una cantidad 0 o negativa,
  cuando se registra el movimiento,
  entonces la API responde **400** "La cantidad debe ser mayor que cero".

## CU-04 Registrar consumo de insumo en una labor (RF-11, RF-12, RN-04)
**Actor:** Operario (app móvil) o almacenero (web).

- **Escenario 1: consumo con stock suficiente.**
  Dado una labor y un insumo con stock 150 kg,
  cuando el operario registra en el móvil un consumo de 20 kg,
  entonces la API responde **201**, el stock baja a 130 kg y queda un movimiento de **SALIDA** en la misma transacción.
- **Escenario 2: stock insuficiente.**
  Dado un insumo con stock 130 kg,
  cuando se intenta consumir 500 kg,
  entonces la API responde **409**, el móvil muestra el mensaje del backend y el stock no cambia.

## CU-05 Completar labor (RF-07, RN-03)
**Actor:** Operario (app móvil).

- **Escenario 1: ejecutar labor planificada.**
  Dado una labor PLANIFICADA,
  cuando el operario toca "Marcar como ejecutada" en el móvil,
  entonces la API responde **200**, la labor pasa a **EJECUTADA** con la fecha de hoy y la lista "Mis labores" lo refleja.
- **Escenario 2: labor ya ejecutada.**
  Dado una labor EJECUTADA,
  cuando se intenta ejecutar otra vez,
  entonces la API responde **409** y el estado no cambia.

## CU-06 Registrar cosecha (RF-14, RN-06, RN-07)
**Actor:** Jefe de campo.

- **Escenario 1: campaña en curso.**
  Dado una campaña EN_CURSO,
  cuando se registra una cosecha con cantidad y unidad,
  entonces la API responde **201**.
- **Escenario 2: campaña no iniciada.**
  Dado una campaña PLANIFICADA,
  cuando se registra una cosecha,
  entonces la API responde **409** "No se puede cosechar una campaña que todavía no se inició".
