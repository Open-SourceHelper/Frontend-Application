import { Observable } from 'rxjs';
import { CrisisAlert, CrisisAlertNotification } from '../model/crisis-alert.model';

export abstract class CrisisAlertRepository {
  abstract findByChild(childId: string): Observable<CrisisAlert[]>;
  abstract create(alert: CrisisAlert): Observable<CrisisAlert>;
  abstract update(alert: CrisisAlert): Observable<CrisisAlert>;
  abstract queueNotification(notification: CrisisAlertNotification): Observable<CrisisAlertNotification>;
  abstract findNotifications(recipientCaregiverId: string): Observable<CrisisAlertNotification[]>;
}
