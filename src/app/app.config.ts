import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpErrorResponse, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AuthService } from './identity-access/infrastructure/services/auth.service';
import { routes } from './app.routes';

import { environment } from '../environments/environment';

const apiTimeout: HttpInterceptorFn = (request, next) => {
  const api = environment.platformProviderApiBaseUrl.replace(/\/$/, '');
  const isPlatformRequest = request.url === api || request.url.startsWith(api + '/');
  if (isPlatformRequest && environment.publicDemo && request.method !== 'GET'
    && inject(AuthService).getCurrentUser()?.publicDemo) {
    return throwError(() => new HttpErrorResponse({
      status: 403,
      statusText: 'La demostración pública es de solo lectura',
      url: request.url,
    }));
  }
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
