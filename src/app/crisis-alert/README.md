# BC03 — Crisis Alert Management (Kinemo Alert)

Módulo Angular independiente creado sobre la rama `feature/bc03-crisis-alert-management`.

## Arquitectura DDD

- `domain/model`: modelo y reglas puras del ciclo de vida de alertas.
- `domain/repositories` y `domain/ports`: contratos abstractos, incluidos permisos provenientes de BC02.
- `application`: servicio de casos de uso (activar, atender, cerrar, consultar e inbox).
- `infrastructure`: adaptadores HTTP a JSON Server, sin importar directamente las implementaciones de otros BC.
- `presentation`: pantalla Angular standalone con Signals, Forms y Angular Material.

La pantalla se sirve en **/crisis-alerts** y se incorpora al menú del layout.

## Flujo de demostración

1. Ejecuta `npm run server` (JSON Server en puerto 3000).
2. En otra terminal, ejecuta `npm start` (Angular).
3. Abre `http://localhost:4200/crisis-alerts`.
4. Usa `child-001` y `caregiver-alert-001` para activar la alerta SOS.
5. La alerta se crea en `crisisAlerts` y un aviso interno queda en `crisisAlertNotifications` para `caregiver-alert-002`.
6. Cambia el ID del cuidador a `caregiver-alert-002` y pulsa Actualizar para consultar sus avisos.
7. Marca la alerta como atendida y luego ciérrala.

## Datos y endpoints mock

- `GET /caregiverAuthorizations?childId=...`: consulta de autorizaciones activas, validando `status` y `revokedAt`.
- `GET /crisisAlerts?childId=...`
- `POST /crisisAlerts`
- `PUT /crisisAlerts/:id`
- `POST /crisisAlertNotifications`
- `GET /crisisAlertNotifications?recipientCaregiverId=...`

La interfaz impide activar una segunda alerta **ACTIVE** para el mismo niño en el flujo normal y permite las transiciones `ACTIVE → ATTENDED → CLOSED`. Estas reglas y la autorización deben **verificarse y garantizarse en el backend Spring Boot** antes de uso real. JSON Server **no** proporciona autenticación, autorización robusta, transacciones ni protección contra carreras entre clientes.

## Limitaciones intencionadas

- No existe pulsera física ni integración con hardware.
- Los avisos son registros `IN_APP/QUEUED`, no entregas reales, SMS o push.
- Los campos de ID representan datos de demostración; en producción provendrán de la sesión autenticada y de BC02.
- No diagnostica, recomienda tratamiento, despacha emergencias ni envía comunicaciones clínicas automáticas.
- No modifica ni elimina BC existentes; su reclasificación según el mapa final de cinco BC corresponde al equipo.
