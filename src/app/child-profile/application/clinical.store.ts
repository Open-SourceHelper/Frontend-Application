import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize } from 'rxjs';

import { ClinicalProfile } from '../domain/model/clinical-profile.entity';
import { ClinicalService } from '../infrastructure/services/clinical.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicalStore {
  private readonly service = inject(ClinicalService);

  private readonly profilesState = signal<ClinicalProfile[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly profiles = this.profilesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly totalProfiles = computed(
    () => this.profilesState().length
  );

  loadProfiles(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.getAll()
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: profiles => {
          this.profilesState.set(profiles);
        },
        error: () => {
          this.errorState.set(
            'No se pudieron cargar los datos.'
          );
        }
      });
  }

  createProfile(profile: ClinicalProfile): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.create(profile)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: created => {
          this.profilesState.update(items => [
            ...items,
            created
          ]);
        },
        error: () => {
          this.errorState.set(
            'No se pudo registrar el perfil clinico.'
          );
        }
      });
  }

  updateProfile(profile: ClinicalProfile): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.update(profile)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: updated => {
          this.profilesState.update(items =>
            items.map(item =>
              item.id === updated.id ? updated : item
            )
          );
        },
        error: () => {
          this.errorState.set(
            'No se pudo actualizar el perfil clinico.'
          );
        }
      });
  }
}
