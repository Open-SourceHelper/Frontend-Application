import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Observation } from '../../domain/model/observation.entity';
import { CrisisSeverity } from '../../domain/model/crisis-severity.enum';
import { ObservationService } from '../../infrastructure/services/observation.service';

@Component({
  selector: 'app-observation-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <section>
      <h1>Registrar observación</h1>
      <p>Registro para el niño de demostración.</p>

      <form #form="ngForm" (ngSubmit)="save()">
        <label for="description">¿Qué ocurrió?</label>
        <textarea
          id="description"
          name="description"
          [(ngModel)]="description"
          required
          rows="5"
          [disabled]="saving()"
        ></textarea>

        <label for="occurredAt">Fecha y hora</label>
        <input
          id="occurredAt"
          name="occurredAt"
          type="datetime-local"
          [(ngModel)]="occurredAt"
          required
          [disabled]="saving()"
        />

        <label for="severity">Intensidad de la crisis</label>
        <select
          id="severity"
          name="severity"
          [(ngModel)]="severity"
          [disabled]="saving()"
        >
          <option value="">No corresponde a una crisis</option>
          <option [value]="levels.Mild">Leve</option>
          <option [value]="levels.Moderate">Moderada</option>
          <option [value]="levels.Severe">Severa</option>
        </select>

        @if (error()) {
          <p role="alert">{{ error() }}</p>
        }

        <div class="actions">
          <button
            type="submit"
            [disabled]="form.invalid || !description.trim() || saving()"
          >
            {{ saving() ? 'Guardando…' : 'Guardar observación' }}
          </button>

          @if (!saving()) {
            <a routerLink="/observations">Cancelar</a>
          }
        </div>
      </form>
    </section>
  `,
  styles: `
    section {
      max-width: 700px;
      margin: 32px auto;
      padding: 24px;
    }

    h1 {
      color: #5b2d91;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    label {
      font-weight: 600;
      margin-top: 12px;
    }

    input, textarea, select {
      padding: 12px;
      border: 1px solid #b8adc5;
      border-radius: 8px;
      font: inherit;
    }

    textarea {
      resize: vertical;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-top: 20px;
    }

    button {
      padding: 12px 18px;
      border: none;
      border-radius: 8px;
      background: #5b2d91;
      color: white;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    a {
      color: #5b2d91;
    }

    [role="alert"] {
      color: #b42318;
    }
  `
})
export class ObservationFormComponent {
  private readonly service = inject(ObservationService);
  private readonly router = inject(Router);

  readonly levels = CrisisSeverity;
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  description = '';
  occurredAt = '';
  severity: CrisisSeverity | '' = '';

  save(): void {
    if (this.saving()) {
      return;
    }

    this.error.set(null);

    if (!this.description.trim() || !this.occurredAt) {
      this.error.set('Completa la descripción y la fecha.');
      return;
    }

    const date = new Date(this.occurredAt);

    if (Number.isNaN(date.getTime())) {
      this.error.set('La fecha no es válida.');
      return;
    }

    if (date.getTime() > Date.now()) {
      this.error.set('La observación no puede tener una fecha futura.');
      return;
    }

    const observation = new Observation({
      id: crypto.randomUUID(),
      childId: 'child-demo-001',
      caregiverId: 'caregiver-demo-001',
      description: this.description,
      occurredAt: date.toISOString(),
      crisisSeverity: this.severity || null
    });

    this.saving.set(true);

    this.service.create(observation)
      .pipe(
        finalize(() => this.saving.set(false))
      )
      .subscribe({
        next: () => {
          void this.router.navigate(['/observations']);
        },
        error: () => {
          this.error.set(
            'No se pudo guardar. Verifica que la API esté encendida.'
          );
        }
      });
  }
}
