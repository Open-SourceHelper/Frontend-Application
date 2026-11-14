import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

import { environment } from '../environments/environment';

const apiTimeout: HttpInterceptorFn = (request, next) => {
  const api = environment.platformProviderApiBaseUrl.replace(/\/$/, '');
  const isPlatformRequest = request.url === api || request.url.startsWith(api + '/');
  return next(isPlatformRequest && request.timeout === undefined
    ? request.clone({ timeout: 10000 })
    : request);
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([apiTimeout])),
  ],
};
