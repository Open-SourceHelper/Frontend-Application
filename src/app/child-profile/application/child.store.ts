import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize } from 'rxjs';

import { Child } from '../domain/model/child.entity';
import { ChildService } from '../infrastructure/services/child.service';

@Injectable({
  providedIn: 'root'
})
export class ChildStore {
  private readonly service = inject(ChildService);

  private readonly childrenState = signal<Child[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly children = this.childrenState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly totalChildren = computed(
    () => this.childrenState().length
  );

  loadChildren(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.getAll()
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: children => {
          this.childrenState.set(children);
        },
        error: () => {
          this.errorState.set(
            'No se pudieron cargar los datos.'
          );
        }
      });
  }

  createChild(child: Child): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.create(child)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: created => {
          this.childrenState.update(items => [
            ...items,
            created
          ]);
        },
        error: () => {
          this.errorState.set(
            'No se pudo registrar al niño.'
          );
        }
      });
  }

  updateChild(child: Child): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.update(child)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: updated => {
          this.childrenState.update(items =>
            items.map(item =>
              item.id === updated.id ? updated : item
            )
          );
        },
        error: () => {
          this.errorState.set(
            'No se pudo actualizar los datos del niño.'
          );
        }
      });
  }
}
