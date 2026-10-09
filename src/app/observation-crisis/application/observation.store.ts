import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { Observation } from '../domain/model/observation.entity';
import { ObservationService } from '../infrastructure/services/observation.service';

@Injectable({
  providedIn: 'root'
})
export class ObservationStore {
  private readonly service = inject(ObservationService);

  readonly observations = signal<Observation[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  loadByChildId(childId: string): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.observations.set([]);

    this.service.getByChildId(childId)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: observations => {
          this.observations.set(observations);
        },
        error: () => {
          this.error.set(
            'No se pudieron cargar las observaciones. Verifica que la API esté encendida.'
          );
        }
      });
  }
}
