import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { DashboardService } from '../infrastructure/services/dashboard.service';
import { ReportPeriod } from '../domain/model/report-period';
import { ObservationSnapshot } from '../domain/model/observation-snapshot';
import { ReportPdfService } from '../infrastructure/services/report-pdf.service';

@Injectable({ providedIn: 'root' })
export class ReportStore {
  private readonly service = inject(DashboardService);
  private readonly pdfService = inject(ReportPdfService);

  private readonly observationsState = signal<ObservationSnapshot[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly observations = this.observationsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly loaded = signal(false);

  search(childId: string, from: string, to: string): void {
    let period: ReportPeriod;

    try {
      period = new ReportPeriod(from, to);
    } catch {
      this.errorState.set('Selecciona un rango de fechas válido.');
      return;
    }

    if (!childId.trim()) {
      this.errorState.set('Falta el identificador del niño.');
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);
    this.loaded.set(false);
    this.observationsState.set([]);

    this.service.getObservations(childId, period)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: items => {
          this.observationsState.set(items);
          this.loaded.set(true);
        },
        error: () => this.errorState.set('No se pudieron cargar las observaciones.')
      });
  }

  download(childId: string, from: string, to: string): void {
    if (!this.loaded() || this.loading()) return;

    try {
      const blob = this.pdfService.create(childId, new ReportPeriod(from, to), this.observations());
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = `kinemo-reporte-${childId}-${from}-${to}.pdf`;
      anchor.click();

      URL.revokeObjectURL(url);
    } catch {
      this.errorState.set('No se pudo generar el PDF.');
    }
  }
}
