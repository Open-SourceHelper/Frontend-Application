import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { PracticalGuide } from '../domain/model/practical-guide.entity';
import { GuideCategory } from '../domain/model/guide-category';
import { PracticalGuideService } from '../infrastructure/services/practical-guide.service';

@Injectable({
  providedIn: 'root'
})
export class PracticalGuideStore {
  private readonly service = inject(PracticalGuideService);

  private readonly guidesState = signal<PracticalGuide[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  private readonly searchState = signal('');
  private readonly categoryState = signal<GuideCategory | null>(null);

  readonly guides = this.guidesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly search = this.searchState.asReadonly();
  readonly selectedCategory = this.categoryState.asReadonly();

  readonly filteredGuides = computed(() => {
    const search = this.searchState().trim();
    const category = this.categoryState();

    return this.guidesState().filter(guide => {
      const matchesSearch =
        !search || guide.buscarPorSituacion(search);

      const matchesCategory =
        category === null || guide.buscarPorCategoria(category);

      return matchesSearch && matchesCategory;
    });
  });

  readonly totalGuides = computed(() => this.guidesState().length);

  loadGuides(): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.getAll()
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: guides => this.guidesState.set(guides),
        error: () => {
          this.errorState.set('No se pudieron cargar las guías prácticas.');
        }
      });
  }

  setSearch(value: string): void {
    this.searchState.set(value);
  }

  setCategory(value: GuideCategory | null): void {
    this.categoryState.set(value);
  }

  clearFilters(): void {
    this.searchState.set('');
    this.categoryState.set(null);
  }
}
