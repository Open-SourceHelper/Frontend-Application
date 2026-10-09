import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ObservationStore } from '../../application/observation.store';
import { CrisisSeverity } from '../../domain/model/crisis-severity.enum';
import { ObservationCommentsComponent } from '../components/observation-comments.component';
import { ObservationEvidencesComponent } from '../components/observation-evidences.component';

type SeverityFilter = 'all' | 'none' | CrisisSeverity;

@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    ObservationCommentsComponent,
    ObservationEvidencesComponent
  ],
  template: `
    <section>
      <h1>Observaciones y crisis</h1>
      <p>Historial del niño de demostración.</p>

      <div class="actions">
        <a class="create-link" routerLink="/observations/new">
          Registrar observación
        </a>

        <button
          type="button"
          (click)="reload()"
          [disabled]="store.loading()"
        >
          Actualizar
        </button>
      </div>

      <div class="filters">
        <div>
          <label for="search">Buscar por descripción</label>
          <input
            id="search"
            type="search"
            placeholder="Escribe una palabra"
            [ngModel]="search()"
            (ngModelChange)="search.set($event)"
          />
        </div>

        <div>
          <label for="severity">Filtrar por intensidad</label>
          <select
            id="severity"
            [ngModel]="severityFilter()"
            (ngModelChange)="severityFilter.set($event)"
          >
            <option value="all">Todas las observaciones</option>
            <option value="none">Sin crisis</option>
            <option [value]="levels.Mild">Crisis leve</option>
            <option [value]="levels.Moderate">Crisis moderada</option>
            <option [value]="levels.Severe">Crisis severa</option>
          </select>
        </div>

        <button type="button" (click)="clearFilters()">
          Limpiar filtros
        </button>
      </div>

      @if (store.loading()) {
        <p role="status">Cargando observaciones…</p>
      } @else if (store.error()) {
        <p role="alert">{{ store.error() }}</p>
      } @else {
        <p aria-live="polite">
          Resultados: {{ filteredObservations().length }}
        </p>

        @for (observation of filteredObservations(); track observation.id) {
          <article>
            <h2>
              {{ observation.isCrisis ? 'Registro de crisis' : 'Observación' }}
            </h2>

            <p>{{ observation.description }}</p>

            <p>
              Fecha:
              {{ observation.occurredAt | date:'dd/MM/yyyy HH:mm' }}
            </p>

            @if (observation.crisisSeverity) {
              <p>
                Intensidad:
                {{ severityLabels[observation.crisisSeverity] }}
              </p>
            }

            <app-observation-evidences
              [observationId]="observation.id"
            ></app-observation-evidences>

            <app-observation-comments
              [observationId]="observation.id"
            ></app-observation-comments>
          </article>
        } @empty {
          <p>No hay observaciones que coincidan con los filtros.</p>
        }
      }
    </section>
  `,
  styles: `
    section {
      max-width: 900px;
      margin: 32px auto;
      padding: 24px;
    }

    h1, h2 {
      color: #5b2d91;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 16px;
      margin-top: 24px;
      padding: 20px;
      background: #f4effa;
      border-radius: 12px;
    }

    .filters > div {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1 1 220px;
      min-width: 0;
    }

    label {
      font-weight: 600;
    }

    input, select {
      padding: 10px;
      border: 1px solid #b8adc5;
      border-radius: 8px;
      font: inherit;
      min-width: 0;
    }

    article {
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #ded6e8;
      border-radius: 12px;
      background: #faf7ff;
      overflow-wrap: anywhere;
    }

    button, .create-link {
      padding: 10px 18px;
      border: none;
      border-radius: 8px;
      background: #5b2d91;
      color: white;
      cursor: pointer;
      font: inherit;
      text-decoration: none;
    }

    button:disabled {
      opacity: 0.6;
      cursor: wait;
    }

    [role="alert"] {
      color: #b42318;
    }
  `
})
export class ObservationListComponent implements OnInit {
  readonly store = inject(ObservationStore);
  readonly levels = CrisisSeverity;

  readonly search = signal('');
  readonly severityFilter = signal<SeverityFilter>('all');

  readonly severityLabels: Record<CrisisSeverity, string> = {
    [CrisisSeverity.Mild]: 'Leve',
    [CrisisSeverity.Moderate]: 'Moderada',
    [CrisisSeverity.Severe]: 'Severa'
  };

  readonly filteredObservations = computed(() => {
    const query = this.search().trim().toLocaleLowerCase('es');
    const severity = this.severityFilter();

    return this.store.observations()
      .filter(observation => {
        const matchesText = observation.description
          .toLocaleLowerCase('es')
          .includes(query);

        const matchesSeverity =
          severity === 'all' ||
          (severity === 'none'
            ? observation.crisisSeverity === null
            : observation.crisisSeverity === severity);

        return matchesText && matchesSeverity;
      })
      .sort((a, b) =>
        Date.parse(b.occurredAt) - Date.parse(a.occurredAt)
      );
  });

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.store.loadByChildId('child-demo-001');
  }

  clearFilters(): void {
    this.search.set('');
    this.severityFilter.set('all');
  }
}
