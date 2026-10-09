import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize } from 'rxjs';

import { CaregiverAuthorization } from '../domain/model/caregiver-authorization.entity';
import { CaregiverService } from '../infrastructure/services/caregiver.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicalGuidelineStore {
  private readonly service = inject(CaregiverService);

  private readonly authorizationsState = signal<CaregiverAuthorization[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly authorizations = this.authorizationsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly totalAuthorizations = computed(
    () => this.authorizationsState().length
  );

  loadAuthorizations(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.getAll()
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: authorizations => {
          this.authorizationsState.set(authorizations);
        },
        error: () => {
          this.errorState.set(
            'No se pudieron cargar los datos.'
          );
        }
      });
  }

  createAuthorizations(authorization: CaregiverAuthorization): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.create(authorization)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: created => {
          this.authorizationsState.update(items => [
            ...items,
            created
          ]);
        },
        error: () => {
          this.errorState.set(
            'No se pudo registrar la autorización.'
          );
        }
      });
  }

  updateAuthorizations(authorization: CaregiverAuthorization): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.update(authorization)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: updated => {
          this.authorizationsState.update(items =>
            items.map(item =>
              item.id === updated.id ? updated : item
            )
          );
        },
        error: () => {
          this.errorState.set(
            'No se pudo actualizar la autorización.'
          );
        }
      });
  }
}
