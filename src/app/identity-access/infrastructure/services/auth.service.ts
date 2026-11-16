
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { UserRole } from '../../domain/model/user-role.enum';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isValidated: boolean;
  createdAt: string;
}

type CurrentUser = Omit<AuthUser, 'password'> & {
  publicDemo?: true;
  localSpring?: { childId: string; profile: string; evaluation?: true };
};

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
  private readonly sessionsUrl = `${environment.platformProviderApiBaseUrl}/userSessions`;

  private readonly apiUrl = `${environment.platformProviderApiBaseUrl}/users`;

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

  signInForDemo(profile = 'familia'): Observable<AuthUser> {
    if (environment.production) {
      return throwError(() => new Error('La demostración solo está disponible en desarrollo.'));
    }
    return this.signIn({ email: profile + '@bc05.example', password: 'KinemoDemo05!' });
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

  private readonly session = signal(this.readSession());

  signOut(): void {
    sessionStorage.removeItem('kinemo-user');
    this.session.set(null);
  }

  saveSession(user: AuthUser): void {
    const { password, ...safeUser } = user;

    this.persistSession(safeUser);
  }

  startLocalSpringDemo(id: string, profile: string, role: UserRole, childId: string): void {
    if (environment.production) return;
    this.persistSession({
      id, role, isValidated: true, email: profile + '@kinemo.example',
      createdAt: new Date().toISOString(),
      localSpring: { childId, profile },
    });
  }

  startEvaluation(id: string, profile: string, role: UserRole, childId: string): void {
    this.signOut();
    this.session.set({
      id, role, isValidated: true, email: profile + '@kinemo.example',
      createdAt: new Date().toISOString(),
      localSpring: { childId, profile, evaluation: true },
    });
  }

  startPublicDemo(): void {
    if (!environment.publicDemo) return;
    this.persistSession({
      id: 'public-demo',
      email: 'visitante@kinemo.example',
      role: UserRole.PARENT,
      isValidated: true,
      createdAt: new Date().toISOString(),
      publicDemo: true,
    });
  }

  private persistSession(user: CurrentUser): void {
    sessionStorage.setItem('kinemo-user', JSON.stringify(user));
    this.session.set(user);
  }

  getCurrentUser(): CurrentUser | null {
    return this.session();
  }

  private readSession(): CurrentUser | null {
    const stored = sessionStorage.getItem('kinemo-user');

    const user: CurrentUser | null = stored ? JSON.parse(stored) : null;
    return environment.production ? null : user;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  startSession(user: AuthUser): void {
    const session = {
      id: crypto.randomUUID(),
      userId: user.id,
      sessionToken: crypto.randomUUID(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      closedAt: null
    };

    this.http.post(this.sessionsUrl, session).subscribe({
      next: () => console.log('Sesión simulada iniciada'),
      error: error => console.error('Error al registrar sesión', error)
    });
  }

  logout(): void {
    const user = this.getCurrentUser();

    if (!user || user.publicDemo || user.localSpring) {
      this.signOut();
      return;
    }

    this.http.get<any[]>(this.sessionsUrl, {
      params: { userId: user.id, status: 'ACTIVE' }
    }).pipe(
      tap(sessions => {
        sessions.forEach(session => {
          this.http.patch(
            `${this.sessionsUrl}/${session.id}`,
            {
              status: 'CLOSED',
              closedAt: new Date().toISOString()
            }
          ).subscribe();
        });
      }),
      catchError(() => of([]))
    ).subscribe();

    this.signOut();
  }
}
