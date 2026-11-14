import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { AuthService } from '../../../identity-access/infrastructure/services/auth.service';
import { UserRole } from '../../../identity-access/domain/model/user-role.enum';
import { environment } from '../../../../environments/environment';

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
  private readonly base = environment.platformProviderApiBaseUrl;

  readonly roles = UserRole;

  readonly demo = !environment.production;

  signInForDemo(profile: string) {
    return this.auth.signIn({ email: profile + '@bc05.example', password: 'KinemoDemo05!' });
  }

  saveDemoSession(user: Parameters<AuthService['saveSession']>[0]) {
    this.auth.saveSession(user);
  }

  currentUser() {
    return this.auth.getCurrentUser();
  }

  availableChildren() {
    return this.http.get<{ id: string; firstName: string; lastName: string }[]>(this.base + '/children');
  }

  canAccess(childId: string) {
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
    return this.http.get<ClosedAlert[]>(this.base + '/crisisAlerts', {
      params: { childId, status: 'CLOSED' }
    });
  }
}
