import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ObservationSnapshot } from '../../domain/model/observation-snapshot';

export interface ReportFilter {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-report-panel',
  standalone: true,
  imports: [FormsModule, DatePipe, MatIconModule],
  templateUrl: './report-panel.html',
  styleUrl: './report-panel.css'
})
export class ReportPanel {
  readonly observations = input<ObservationSnapshot[]>([]);
  readonly loading = input(false);
  readonly loaded = input(false);
  readonly error = input<string | null>(null);

  readonly search = output<ReportFilter>();
  readonly exportPdf = output<ReportFilter>();

  startDate = this.isoDate(-7);
  endDate = this.isoDate(0);

  private isoDate(offsetDays: number): string {
    const today = new Date();
    today.setDate(today.getDate() + offsetDays);

    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
  }

  find(): void {
    this.search.emit({ startDate: this.startDate, endDate: this.endDate });
  }

  download(): void {
    this.exportPdf.emit({ startDate: this.startDate, endDate: this.endDate });
  }
}
