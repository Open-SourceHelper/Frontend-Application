import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserRole } from '../../identity-access/domain/model/user-role.enum';
import { AuthService } from '../../identity-access/infrastructure/services/auth.service';

type DemoRole = 'FAMILY' | 'CAREGIVER' | 'PSYCHOLOGIST';

interface DemoSession {
  childId: number;
  role: DemoRole;
}

const roles: Record<DemoRole, UserRole> = {
  FAMILY: UserRole.PARENT,
  CAREGIVER: UserRole.CAREGIVER,
  PSYCHOLOGIST: UserRole.PSYCHOLOGIST,
};

export const localAccounts = [
  { name: 'Familia', id: '7001', key: 'familia' },
  { name: 'Cuidador', id: '7002', key: 'cuidador' },
  { name: 'Psicóloga', id: '7003', key: 'psicologa' },
];

@Injectable({ providedIn: 'root' })
export class LocalSpringApi {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  get session() {
    const user = this.auth.getCurrentUser();
    return !environment.production && user?.localSpring ? user : null;
  }

  signIn(accountId: string): Observable<DemoSession> {
    const account = localAccounts.find(item => item.id === accountId);
    if (environment.production || !account) {
      return throwError(() => new Error('La cuenta de prueba no está disponible.'));
    }
    return this.send<DemoSession>(accountId, 'GET', '/local-demo/session').pipe(
      tap(session => this.auth.startLocalSpringDemo(accountId, account.key, roles[session.role], String(session.childId))),
    );
  }

  signInAs(profile: string) {
    const account = localAccounts.find(item => item.key === profile);
    return this.signIn(account?.id ?? '').pipe(map(() => this.session));
  }

  request<T>(method: string, path: string, body?: unknown): Observable<T> {
    const user = this.session;
    if (!user) return throwError(() => new Error('Elige una cuenta de prueba.'));
    return this.send<T>(user.id, method, path, body);
  }

  private send<T>(accountId: string, method: string, path: string, body?: unknown): Observable<T> {
    return this.http.request<T>(method, '/api/v1' + path, {
      body,
      headers: { Authorization: 'Basic ' + btoa(accountId + ':demo123') },
      timeout: 10000,
    });
  }
}
