import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ObservationStore } from '../../application/observation.store';
import { CrisisSeverity } from '../../domain/model/crisis-severity.enum';

@Component({
  selector: 'app-observation-list',
  standalone: true,
  imports: [DatePipe],
  template: `
    <section>
      <h1>Observaciones y crisis</h1>
      <p>Historial del niño de demostración.</p>

      <button
        type="button"
        (click)="reload()"
        [disabled]="store.loading()"
      >
        Actualizar
      </button>

      @if (store.loading()) {
        <p role="status">Cargando observaciones…</p>
      } @else if (store.error()) {
        <p role="alert">{{ store.error() }}</p>
      } @else {
        @for (observation of store.observations(); track observation.id) {
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
          </article>
        } @empty {
          <p>No hay observaciones registradas.</p>
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

    article {
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #ded6e8;
      border-radius: 12px;
      background: #faf7ff;
    }

    button {
      padding: 10px 18px;
      border: none;
      border-radius: 8px;
      background: #5b2d91;
      color: white;
      cursor: pointer;
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

  readonly severityLabels: Record<CrisisSeverity, string> = {
    [CrisisSeverity.Mild]: 'Leve',
    [CrisisSeverity.Moderate]: 'Moderada',
    [CrisisSeverity.Severe]: 'Severa'
  };

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.store.loadByChildId('child-demo-001');
  }
}
