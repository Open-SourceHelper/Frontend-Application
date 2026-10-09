import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DailySummary } from '../../domain/model/daily-summary';
import { DailySummaryResource } from '../resources/daily-summary.resource';
import { DailySummaryAssembler } from '../assemblers/daily-summary.assembler';
import { ObservationSnapshot } from '../../domain/model/observation-snapshot';
import { ObservationResource } from '../resources/observation.resource';
import { ReportPeriod } from '../../domain/model/report-period';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  getDailySummary(childId: string, date: string): Observable<DailySummary | null> {
    const params = new HttpParams()
      .set('childId', childId)
      .set('date', date);

    return this.http.get<DailySummaryResource[]>(`${this.baseUrl}/dailySummaries`, { params })
      .pipe(
        map(rows =>
          rows.length
            ? DailySummaryAssembler.toEntityFromResource(rows[0])
            : null
        )
      );
  }

  getObservations(childId: string, period: ReportPeriod): Observable<ObservationSnapshot[]> {
    const params = new HttpParams()
      .set('childId', childId);

    return this.http.get<ObservationResource[]>(`${this.baseUrl}/observations`, { params })
      .pipe(
        map(rows =>
          rows.filter(row => period.contains(row.createdAt))
            .map(row => ({
              id: row.id,
              childId: row.childId,
              createdAt: row.createdAt,
              author: row.author ?? 'Sin autor',
              description: row.description ?? '',
              category: row.category
            }))
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        )
      );
  }
}
