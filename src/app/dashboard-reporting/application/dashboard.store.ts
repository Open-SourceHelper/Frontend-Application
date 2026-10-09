import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { DailySummary, completionPercentage } from '../domain/model/daily-summary';
import { DashboardService } from '../infrastructure/services/dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly service = inject(DashboardService);

  private readonly summaryState = signal<DailySummary | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly summary = this.summaryState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly completion = computed(() =>
    this.summaryState() ? completionPercentage(this.summaryState()!) : 0
  );

  loadSummary(childId: string, date: string): void {
    if (!childId.trim()) {
      this.errorState.set('Indica un niño para consultar el panel.');
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);
    this.summaryState.set(null);

    this.service.getDailySummary(childId, date)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: summary => this.summaryState.set(summary),
        error: () => this.errorState.set('No se pudo cargar el resumen diario.')
      });
  }
}
