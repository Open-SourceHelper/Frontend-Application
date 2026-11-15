import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of, shareReplay, switchMap } from 'rxjs';
import type { SpringEpisode } from '../../observation-crisis-history/infrastructure/resources/spring-episode';

interface DemoActivity {
  id: string;
  title: string;
  durationMinutes: number;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
}

export interface PublicDemoSnapshot {
  source: 'spring-boot';
  child: { id: string; firstName: string; lastName: string; birthDate: string };
  episodes: SpringEpisode[];
  routines: { id: string; title: string; scheduledDate: string; activities: DemoActivity[] }[];
  guidelines: { id: string; title: string; instructions: string; status: 'PUBLISHED' }[];
  guides: { id: string; title: string; content: string; category: string }[];
}

@Injectable({ providedIn: 'root' })
export class PublicSpringDemo {
  private readonly http = inject(HttpClient);

  readonly base = this.http.get<{ springDemoApi?: string }>('/kinemo-runtime.json', { timeout: 5000 }).pipe(
    map(config => config.springDemoApi ?? ''),
    catchError(() => of('')),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  readonly snapshot = this.base.pipe(
    switchMap(base => base
      ? this.http.get<PublicDemoSnapshot>(base + '/api/v1/public-demo/snapshot', { timeout: 90000 })
      : of(null)),
    shareReplay({ bufferSize: 1, refCount: false }),
  );
}
