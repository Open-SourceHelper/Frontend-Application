import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize, Observable } from 'rxjs';

import { CrisisAlertService } from '../../application/crisis-alert.service';
import { CrisisAlert, CrisisAlertNotification } from '../../domain/model/crisis-alert.model';
import { CrisisAlertRepository } from '../../domain/repositories/crisis-alert.repository';
import { CaregiverAuthorizationPort } from '../../domain/ports/caregiver-authorization.port';
import { CrisisAlertJsonServerRepository } from '../../infrastructure/crisis-alert-json-server.repository';
import { CaregiverAuthorizationJsonServerAdapter } from '../../infrastructure/caregiver-authorization-json-server.adapter';

@Component({
  selector: 'app-crisis-alert-list',
  standalone: true,
  imports: [DatePipe, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  providers: [
    CrisisAlertService,
    { provide: CrisisAlertRepository, useClass: CrisisAlertJsonServerRepository },
    { provide: CaregiverAuthorizationPort, useClass: CaregiverAuthorizationJsonServerAdapter }
  ],
  templateUrl: './crisis-alert-list.html',
  styleUrl: './crisis-alert-list.css'
})
export class CrisisAlertList implements OnInit {
  private readonly service = inject(CrisisAlertService);
  private readonly route = inject(ActivatedRoute);

  readonly alerts = signal<CrisisAlert[]>([]);
  readonly notifications = signal<CrisisAlertNotification[]>([]);
  readonly busy = signal(false);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  childId = 'child-001';
  caregiverId = 'caregiver-alert-001';
  description = '';

  ngOnInit(): void {
    this.childId = this.route.snapshot.queryParamMap.get('childId') || this.childId;
    this.refresh();
  }

  refresh(): void {
    this.error.set('');
    this.loading.set(true);
    this.service.list(this.childId).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: items => this.alerts.set(items),
      error: () => this.error.set('No se pudieron cargar las alertas. Ejecuta JSON Server en el puerto 3000.')
    });
    this.service.inbox(this.caregiverId).subscribe({
      next: items => this.notifications.set(items),
      error: () => this.notifications.set([])
    });
  }

  activate(): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.success.set('');

    this.service.activate({
      childId: this.childId,
      caregiverId: this.caregiverId,
      description: this.description
    }).pipe(finalize(() => this.busy.set(false))).subscribe({
      next: result => {
        this.description = '';
        const warning = result.failedCount > 0
          ? ` No se pudieron encolar ${result.failedCount} avisos internos.`
          : '';
        this.success.set(
          `Alerta registrada. Avisos internos encolados: ${result.queuedCount}.${warning}`
        );
        this.refresh();
      },
      error: err => this.error.set(err?.message || 'No fue posible registrar la alerta.')
    });
  }

  attend(alert: CrisisAlert): void {
    this.changeStatus(this.service.attend(alert, this.caregiverId));
  }

  close(alert: CrisisAlert): void {
    this.changeStatus(this.service.close(alert, this.caregiverId));
  }

  private changeStatus(request: Observable<CrisisAlert>): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.success.set('');
    request.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => {
        this.success.set('Estado actualizado.');
        this.refresh();
      },
      error: err => this.error.set(err?.message || 'No fue posible actualizar la alerta.')
    });
  }
}
