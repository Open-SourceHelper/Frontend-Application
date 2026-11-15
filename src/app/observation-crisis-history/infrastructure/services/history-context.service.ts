import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { AuthService } from '../../../identity-access/infrastructure/services/auth.service';
import { UserRole } from '../../../identity-access/domain/model/user-role.enum';
import { environment } from '../../../../environments/environment';

import { LocalSpringApi } from '../../../shared/infrastructure/local-spring-api';
import { episodePath } from '../resources/spring-episode';

export interface ClosedAlert {
  id: string;
  childId: string;
  description: string;
  status: 'CLOSED';
  createdAt: string;
  closedAt: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryContextService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly spring = inject(LocalSpringApi);
  private readonly base = environment.platformProviderApiBaseUrl;

  readonly roles = UserRole;

  readonly demo = !environment.production;

  signInForDemo(profile: string) {
    return this.auth.signInForDemo(profile);
  }

  switchLocalProfile(profile: string) {
    return this.spring.signInAs(profile);
  }

  saveDemoSession(user: Parameters<AuthService['saveSession']>[0]) {
    this.auth.saveSession(user);
  }

  currentUser() {
    return this.auth.getCurrentUser();
  }

  availableChildren() {
    const user = this.spring.session;
    if (user?.localSpring) {
      const id = user.localSpring.childId;
      const fallback = [{ id, firstName: 'Perfil infantil', lastName: id }];
      if (user.role === UserRole.PSYCHOLOGIST) return of(fallback);
      return this.spring.request<{ id: number; firstName: string; lastName: string }>(
        'GET', '/children/' + encodeURIComponent(id),
      ).pipe(
        map(child => [{ ...child, id: String(child.id) }]),
        catchError(error => error instanceof HttpErrorResponse && error.status === 403
          ? of(fallback) : throwError(() => error)),
      );
    }
    return this.http.get<{ id: string; firstName: string; lastName: string }[]>(this.base + '/children');
  }

  canAccess(childId: string) {
    if (this.spring.session) {
      return this.spring.request('GET', episodePath(childId) + '?size=1').pipe(
        map(() => true),
        catchError(error => error instanceof HttpErrorResponse && [401, 403].includes(error.status)
          ? of(false) : throwError(() => error)),
      );
    }
    const user = this.currentUser();
    if (!user) return of(false);
    const endpoint = user.role === UserRole.PARENT ? '/children'
      : user.role === UserRole.CAREGIVER ? '/caregiverAuthorizations' : '/patientAssignments';
    const params: Record<string, string> = user.role === UserRole.PARENT ? { id: childId, parentId: user.id }
      : user.role === UserRole.CAREGIVER ? { childId, caregiverId: user.id }
      : { childId, psychologistId: user.id };
    return this.http.get<{ status?: string }[]>(this.base + endpoint, {
      params
    }).pipe(map(items => items.some(item =>
      user.role === UserRole.PARENT || item.status?.toUpperCase() === 'ACTIVE')));
  }

  closedAlerts(childId: string) {
    if (this.spring.session) {
      if (this.spring.session.role === UserRole.PSYCHOLOGIST) return of([]);
      return this.spring.request<(Omit<ClosedAlert, 'status' | 'description'> & {
        status: string; description: string | null;
      })[]>('GET', '/crisis-alerts?childId=' + encodeURIComponent(childId)).pipe(
        map(alerts => alerts.flatMap(alert => alert.status === 'CLOSED'
          ? [{ ...alert, status: 'CLOSED' as const, description: alert.description ?? '' }]
          : [])),
      );
    }
    return this.http.get<ClosedAlert[]>(this.base + '/crisisAlerts', {
      params: { childId, status: 'CLOSED' }
    });
  }
}
