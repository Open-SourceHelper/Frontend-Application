
import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize } from 'rxjs';

import { CareNetwork } from '../domain/model/care-network.entity';
import { CareNetworkService } from '../infrastructure/services/care-network.service';

@Injectable({
  providedIn: 'root'
})
export class CareNetworkStore {

  private readonly service = inject(CareNetworkService);

  private readonly networksState = signal<CareNetwork[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly networks = this.networksState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly totalNetworks = computed(
    () => this.networksState().length
  );

  loadNetworks(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.getAll()
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: networks => {
          this.networksState.set(networks);
        },
        error: () => {
          this.errorState.set(
            'No se pudieron cargar las redes de cuidado.'
          );
        }
      });
  }

  createNetwork(network: CareNetwork): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.create(network)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: created => {
          this.networksState.update(items => [
            ...items,
            created
          ]);
        },
        error: () => {
          this.errorState.set(
            'No se pudo crear la red de cuidado.'
          );
        }
      });
  }
}
