
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { UserRole } from '../../domain/model/user-role.enum';

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isValidated: boolean;
  createdAt: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/users';

  signIn(credentials: SignInRequest): Observable<AuthUser> {
    const params = new HttpParams()
      .set('email', credentials.email);

    return this.http.get<AuthUser[]>(this.apiUrl, { params }).pipe(
      map(users => {
        const user = users.find(
          u => u.password === credentials.password
        );

        if (!user) {
          throw new Error('Correo o contraseña incorrectos');
        }

        return user;
      })
    );
  }

  signUp(data: SignUpRequest): Observable<AuthUser> {
    const params = new HttpParams().set('email', data.email);

    return this.http.get<AuthUser[]>(this.apiUrl, { params }).pipe(
      switchMap(users => {
        if (users.length > 0) {
          return throwError(
            () => new Error('Este correo ya está registrado')
          );
        }

        const newUser: AuthUser = {
          id: crypto.randomUUID(),
          email: data.email,
          password: data.password,
          role: data.role,
          isValidated: true,
          createdAt: new Date().toISOString()
        };

        return this.http.post<AuthUser>(this.apiUrl, newUser);
      })
    );
  }

  signOut(): void {
    sessionStorage.removeItem('kinemo-user');
  }

  saveSession(user: AuthUser): void {
    const { password, ...safeUser } = user;

    sessionStorage.setItem(
      'kinemo-user',
      JSON.stringify(safeUser)
    );
  }

  getCurrentUser(): Omit<AuthUser, 'password'> | null {
    const stored = sessionStorage.getItem('kinemo-user');

    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
