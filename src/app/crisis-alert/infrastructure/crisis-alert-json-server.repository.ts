import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CrisisAlert, CrisisAlertNotification } from '../domain/model/crisis-alert.model';
import { CrisisAlertRepository } from '../domain/repositories/crisis-alert.repository';

@Injectable()
export class CrisisAlertJsonServerRepository extends CrisisAlertRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  findByChild(childId: string): Observable<CrisisAlert[]> {
    return this.http.get<CrisisAlert[]>(`${this.baseUrl}/crisisAlerts`, {
      params: new HttpParams().set('childId', childId)
    });
  }

  create(alert: CrisisAlert): Observable<CrisisAlert> {
    return this.http.post<CrisisAlert>(`${this.baseUrl}/crisisAlerts`, alert);
  }

  update(alert: CrisisAlert): Observable<CrisisAlert> {
    return this.http.put<CrisisAlert>(
      `${this.baseUrl}/crisisAlerts/${encodeURIComponent(alert.id)}`,
      alert
    );
  }

  queueNotification(notification: CrisisAlertNotification): Observable<CrisisAlertNotification> {
    return this.http.post<CrisisAlertNotification>(
      `${this.baseUrl}/crisisAlertNotifications`,
      notification
    );
  }

  findNotifications(recipientCaregiverId: string): Observable<CrisisAlertNotification[]> {
    return this.http.get<CrisisAlertNotification[]>(
      `${this.baseUrl}/crisisAlertNotifications`,
      { params: new HttpParams().set('recipientCaregiverId', recipientCaregiverId) }
    );
  }
}
