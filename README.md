# FrontendApplicationOP

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.
LOGO CREATED WITH https://editor.method.ac/

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Prueba local con Spring Boot

Arranca `Backend-Application` con el perfil `local` en el puerto 8080. En este frontend, ejecuta `npm ci` y `npm start`. En la pantalla de inicio de sesión, pulsa **Probar con el backend local**, o abre `http://localhost:4200/backend-local`.

La vista usa el proxy de desarrollo de Angular para enviar `/api/v1` a Spring Boot. Elige **Familia**, **Cuidador** o **Psicóloga**. Las tres cuentas de prueba comparten el mismo perfil infantil de H2. Puedes crear y completar una rutina, cerrar una alerta, registrarla como episodio y revisarla con la cuenta profesional.

La vista requiere la versión del backend con `GET /api/v1/local-demo/session`. Los datos de prueba se restablecen al reiniciar Spring Boot. Desde la vista local puedes abrir **Alertas de cuidado** e **Historial de episodios** en el menú habitual. Ambas pantallas consultan la API Spring Boot con la misma cuenta de prueba. La alerta cerrada abre el formulario del historial con su descripción, fecha e identificador. El historial muestra los registros, estadísticas y comentarios que devuelve Spring Boot.

Desde ese menú también puedes usar **Perfil infantil**, **Perfil clínico**, **Red de cuidado** y **Orientaciones y rutinas** con Spring Boot. La familia administra el perfil y la red y puede crear rutinas. El cuidador autorizado consulta el perfil y completa actividades. La psicóloga puede publicar pautas, ver sus pacientes y revisar episodios. Una vez retirado el acceso del cuidador, Spring Boot bloquea las consultas al perfil, las rutinas y el historial.

Desde **Rutinas**, la familia puede duplicar o archivar una rutina. En **Editar actividades** puede agregar actividades y subir apoyos visuales JPG o PNG. El cuidador autorizado puede abrir esos apoyos y usar el temporizador de transición.

Las invitaciones se registran en la red de cuidado. Su aceptación con cuentas reales requiere IAM y correo verificado. La demo pública sigue disponible con los datos ficticios.

## Demo pública desde Spring Boot en Render

En el sitio estático, usa la rama que contiene `build:render`, **Build Command** `npm ci && npm run build:render` y **Publish Directory** `dist/frontend-application-OP/browser`. Define `KINEMO_PUBLIC_API_BASE` con el origen HTTPS del Web Service de Spring Boot, sin ruta ni barra final. Conserva el rewrite de `/*` a `/index.html`.

En la web, elige **Entrar a la demo** y abre **Historial de episodios** u **Orientaciones y rutinas**. Con la API configurada, ambas pantallas muestran datos ficticios de Spring Boot en modo de solo lectura.

## Evaluación en línea

En el sitio estático de Render, selecciona la rama de evaluación y define `KINEMO_EVALUATION_API_BASE` con el origen HTTPS del Web Service que corre el perfil `evaluation`. Usa `npm ci && npm run build:render`, el directorio `dist/frontend-application-OP/browser` y el rewrite `/*` a `/index.html`. Si el sitio ya ofrece la demo pública, conserva su URL en `KINEMO_PUBLIC_API_BASE`.

Abre `/evaluacion` y selecciona **Familia (7001)**, **Cuidador (7002)** o **Psicóloga (7003)**. Usa la contraseña correspondiente configurada en el backend. Al recargar la página, vuelve a iniciar sesión. Los cambios se guardan en la base de datos del Web Service.
