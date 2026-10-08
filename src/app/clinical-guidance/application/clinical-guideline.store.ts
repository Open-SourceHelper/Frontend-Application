import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize } from 'rxjs';

import { ClinicalGuideline } from '../domain/model/clinical-guideline.entity';
import { ClinicalGuidelineService } from '../infrastructure/services/clinical-guideline.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicalGuidelineStore {

  private readonly service = inject(ClinicalGuidelineService);

  private readonly guidelinesState = signal<ClinicalGuideline[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly guidelines = this.guidelinesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly totalGuidelines = computed(
    () => this.guidelinesState().length
  );

  loadGuidelines(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.getAll()
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: guidelines => {
          this.guidelinesState.set(guidelines);
        },
        error: () => {
          this.errorState.set(
            'No se pudieron cargar las pautas clínicas.'
          );
        }
      });
  }

  createGuideline(guideline: ClinicalGuideline): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.create(guideline)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: created => {
          this.guidelinesState.update(items => [
            ...items,
            created
          ]);
        },
        error: () => {
          this.errorState.set(
            'No se pudo registrar la pauta clínica.'
          );
        }
      });
  }

  updateGuideline(guideline: ClinicalGuideline): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.update(guideline)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: updated => {
          this.guidelinesState.update(items =>
            items.map(item =>
              item.id === updated.id ? updated : item
            )
          );
        },
        error: () => {
          this.errorState.set(
            'No se pudo actualizar la pauta clínica.'
          );
        }
      });
  }
}
