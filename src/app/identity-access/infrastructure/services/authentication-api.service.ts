import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserRole } from '../../domain/model/user-role.enum';
import { environment } from '../../../../environments/environment';

export interface AuthenticationUser {
  id: string;
  email: string;
  role: UserRole;
  isValidated: boolean;
  createdAt: string;
}

export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthenticationResponse {
  user: AuthenticationUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationApiService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    environment.platformProviderApiBaseUrl;

  private readonly signInUrl =
    `${this.baseUrl}${environment.platformProviderSignInEndpointPath}`;

  private readonly signUpUrl =
    `${this.baseUrl}${environment.platformProviderSignUpEndpointPath}`;

  signIn(
    request: AuthenticationRequest
  ): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      this.signInUrl,
      request
    );
  }

  signUp(
    request: RegistrationRequest
  ): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      this.signUpUrl,
      request
    );
  }
}