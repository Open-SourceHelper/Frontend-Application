import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserRole } from '../../identity-access/domain/model/user-role.enum';
import { AuthService } from '../../identity-access/infrastructure/services/auth.service';

import { PublicSpringDemo } from './public-spring-demo';

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
  private readonly publicConfig = inject(PublicSpringDemo);
  private evaluation: { id: string; base: string; authorization: string } | null = null;

  get session() {
    const user = this.auth.getCurrentUser();
    return user?.localSpring && (user.localSpring.evaluation
      ? this.evaluation?.id === user.id : !environment.production) ? user : null;
  }

  signIn(accountId: string): Observable<DemoSession> {
    const account = localAccounts.find(item => item.id === accountId);
    if (environment.production || !account) {
      return throwError(() => new Error('La cuenta de prueba no está disponible.'));
    }
    return this.http.get<DemoSession>('/api/v1/local-demo/session', this.localRequestOptions(accountId)).pipe(
      tap(session => this.auth.startLocalSpringDemo(accountId, account.key, roles[session.role], String(session.childId))),
    );
  }

  signInForEvaluation(accountId: string, password: string): Observable<DemoSession> {
    const account = localAccounts.find(item => item.id === accountId);
    if (!account) return throwError(() => new Error('Selecciona una cuenta de evaluación.'));
    const authorization = 'Basic ' + btoa(account.id + ':' + password);
    return this.publicConfig.evaluationBase.pipe(
      switchMap(base => base
        ? this.http.get<DemoSession>(base + '/api/v1/local-demo/session', {
          headers: { Authorization: authorization }, timeout: 120000,
        }).pipe(tap(session => {
          this.evaluation = { id: account.id, base, authorization };
          this.auth.startEvaluation(account.id, account.key, roles[session.role], String(session.childId));
        }))
        : throwError(() => new Error('La API de evaluación todavía no está configurada.'))),
    );
  }

  clearEvaluation(): void {
    this.evaluation = null;
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

  readFile(path: string): Observable<Blob> {
    const user = this.session;
    if (!user) return throwError(() => new Error('Elige una cuenta de prueba.'));
    return this.http.get(this.requestBase() + '/api/v1' + path, { ...this.requestOptions(user.id), responseType: 'blob' });
  }

  private send<T>(accountId: string, method: string, path: string, body?: unknown): Observable<T> {
    return this.http.request<T>(method, this.requestBase() + '/api/v1' + path, {
      body,
      ...this.requestOptions(accountId),
    });
  }

  private requestBase(): string {
    return this.session?.localSpring?.evaluation ? this.evaluation?.base ?? '' : '';
  }

  private requestOptions(accountId: string) {
    if (this.session?.localSpring?.evaluation && this.evaluation) {
      return { headers: { Authorization: this.evaluation.authorization, 'X-Kinemo-Intent': 'evaluation' }, timeout: 120000 };
    }
    return this.localRequestOptions(accountId);
  }

  private localRequestOptions(accountId: string) {
    return { headers: { Authorization: 'Basic ' + btoa(accountId + ':demo123') }, timeout: 10000 };
  }
}
