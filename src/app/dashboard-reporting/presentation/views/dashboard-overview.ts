import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStore } from '../../application/dashboard.store';
import { ReportStore } from '../../application/report.store';
import { DailySummaryCard } from '../components/daily-summary-card';
import { ReportFilter, ReportPanel } from '../components/report-panel';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [FormsModule, MatIconModule, DailySummaryCard, ReportPanel],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.css'
})
export class DashboardOverview implements OnInit {
  readonly childId = input.required<string>();
  readonly dashboard = inject(DashboardStore);
  readonly reports = inject(ReportStore);

  selectedDate = this.today();

  private today(): string {
    const date = new Date();

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.dashboard.loadSummary(this.childId(), this.selectedDate);
  }

  searchReports(filter: ReportFilter): void {
    this.reports.search(this.childId(), filter.startDate, filter.endDate);
  }

  exportReports(filter: ReportFilter): void {
    this.reports.download(this.childId(), filter.startDate, filter.endDate);
  }
}
