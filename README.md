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

En esta sesión, el menú muestra las pantallas conectadas al backend. Para probar perfiles, rutinas y orientaciones, usa **Prueba local**. La demo pública sigue disponible con los datos ficticios.
