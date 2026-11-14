import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  concatMap,
  from,
  map,
  of,
  switchMap,
  throwError,
  toArray
} from 'rxjs';
import {
  ActivateCrisisAlertCommand,
  AlertActivationResult,
  CrisisAlert,
  CrisisAlertNotification
} from '../domain/model/crisis-alert.model';
import { createCrisisAlert, transitionCrisisAlert } from '../domain/model/crisis-alert.rules';
import { CaregiverAuthorizationPort } from '../domain/ports/caregiver-authorization.port';
import { CrisisAlertRepository } from '../domain/repositories/crisis-alert.repository';

@Injectable()
export class CrisisAlertService {
  private readonly repository = inject(CrisisAlertRepository);
  private readonly authorizations = inject(CaregiverAuthorizationPort);

  list(childId: string): Observable<CrisisAlert[]> {
    return this.repository.findByChild(childId.trim()).pipe(
      map(items => [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    );
  }

  inbox(caregiverId: string): Observable<CrisisAlertNotification[]> {
    return this.repository.findNotifications(caregiverId.trim()).pipe(
      map(items => [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
    );
  }

  activate(command: ActivateCrisisAlertCommand): Observable<AlertActivationResult> {
    const childId = command.childId.trim();
    const caregiverId = command.caregiverId.trim();
    if (!childId || !caregiverId) {
      return throwError(() => new Error('Completa el niño y el cuidador.'));
    }

    return this.authorizedActors(childId, caregiverId).pipe(
      switchMap(authorizedIds => this.repository.findByChild(childId).pipe(
        switchMap(existing => {
          if (existing.some(item => item.status !== 'CLOSED')) {
            return throwError(() => new Error('Ya existe una alerta sin cerrar para este niño.'));
          }

          const recipients = authorizedIds.filter(id => id !== caregiverId);
          const created = createCrisisAlert(
            command,
            recipients,
            crypto.randomUUID(),
            new Date().toISOString()
          );

          return this.repository.create(created).pipe(
            switchMap(alert => {
              if (recipients.length === 0) {
                return of({ alert, queuedCount: 0, failedCount: 0 });
              }

              const notifications: CrisisAlertNotification[] = recipients.map(recipientCaregiverId => ({
                id: crypto.randomUUID(),
                alertId: alert.id,
                childId,
                recipientCaregiverId,
                channel: 'IN_APP',
                status: 'QUEUED',
                createdAt: new Date().toISOString()
              }));

              return from(notifications).pipe(
                concatMap(notification => this.repository.queueNotification(notification).pipe(
                  map(() => true),
                  catchError(() => of(false))
                )),
                toArray(),
                map(results => ({
                  alert,
                  queuedCount: results.filter(Boolean).length,
                  failedCount: results.filter(result => !result).length
                }))
              );
            })
          );
        })
      ))
    );
  }

  attend(alert: CrisisAlert, caregiverId: string): Observable<CrisisAlert> {
    return this.advance(alert, caregiverId, 'ATTENDED');
  }

  close(alert: CrisisAlert, caregiverId: string): Observable<CrisisAlert> {
    return this.advance(alert, caregiverId, 'CLOSED');
  }

  private advance(
    alert: CrisisAlert,
    caregiverId: string,
    nextStatus: 'ATTENDED' | 'CLOSED'
  ): Observable<CrisisAlert> {
    return this.authorizedActors(alert.childId, caregiverId).pipe(
      switchMap(() => this.repository.update(
        transitionCrisisAlert(alert, nextStatus, caregiverId, new Date().toISOString())
      ))
    );
  }

  private authorizedActors(childId: string, caregiverId: string): Observable<string[]> {
    return this.authorizations.findActiveCaregiverIds(childId).pipe(
      switchMap(ids => ids.includes(caregiverId)
        ? of(ids)
        : throwError(() => new Error('Este cuidador no tiene autorización activa para el niño.'))
      )
    );
  }
}
