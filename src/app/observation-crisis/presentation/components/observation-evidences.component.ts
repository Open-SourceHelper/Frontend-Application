import {
  Component,
  Input,
  OnChanges,
  inject,
  signal
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { ObservationEvidence } from '../../domain/model/observation-evidence.entity';
import { ObservationEvidenceService } from '../../infrastructure/services/observation-evidence.service';

@Component({
  selector: 'app-observation-evidences',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <section>
      <h3>Evidencias</h3>

      @if (loading()) {
        <p role="status">Cargando evidencias…</p>
      }

      @if (loadError()) {
        <p role="alert">{{ loadError() }}</p>
        <button type="button" (click)="loadEvidences()">
          Reintentar
        </button>
      }

      @if (!loading() && !loadError()) {
        @for (evidence of evidences(); track evidence.id) {
          <article>
            <a
              [href]="evidence.fileUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ evidence.fileName }}
            </a>

            <p>
              Registrado:
              {{ evidence.uploadedAt | date:'dd/MM/yyyy HH:mm' }}
            </p>
          </article>
        } @empty {
          <p>Todavía no hay evidencias registradas.</p>
        }
      }

      <form #form="ngForm" (ngSubmit)="saveEvidence()">
        <label [for]="'evidence-name-' + observationId">
          Nombre de la evidencia
        </label>

        <input
          [id]="'evidence-name-' + observationId"
          name="fileName"
          type="text"
          [(ngModel)]="fileName"
          required
          [disabled]="saving()"
        />

        <label [for]="'evidence-url-' + observationId">
          Enlace del archivo
        </label>

        <input
          [id]="'evidence-url-' + observationId"
          name="fileUrl"
          type="url"
          placeholder="https://..."
          [(ngModel)]="fileUrl"
          required
          [disabled]="saving()"
        />

        <small>
          Agrega el enlace de un archivo existente.
          Este formulario no sube archivos.
        </small>

        @if (saveError()) {
          <p role="alert">{{ saveError() }}</p>
        }

        @if (success()) {
          <p role="status">{{ success() }}</p>
        }

        <button
          type="submit"
          [disabled]="
            form.invalid ||
            !fileName.trim() ||
            !fileUrl.trim() ||
            saving() ||
            loading() ||
            !!loadError()
          "
        >
          {{ saving() ? 'Guardando…' : 'Agregar evidencia' }}
        </button>
      </form>
    </section>
  `,
  styles: `
    section {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #ded6e8;
    }

    h3, a {
      color: #5b2d91;
    }

    article {
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 8px;
      background: white;
      overflow-wrap: anywhere;
    }

    article p, small {
      color: #62586e;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 16px;
    }

    label {
      font-weight: 600;
    }

    input {
      padding: 12px;
      border: 1px solid #b8adc5;
      border-radius: 8px;
      font: inherit;
      min-width: 0;
    }

    button {
      align-self: flex-start;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      background: #5b2d91;
      color: white;
      font: inherit;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    [role="alert"] {
      color: #b42318;
    }
  `
})
export class ObservationEvidencesComponent implements OnChanges {
  @Input({ required: true }) observationId = '';

  private readonly service = inject(ObservationEvidenceService);

  readonly evidences = signal<ObservationEvidence[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  fileName = '';
  fileUrl = '';

  ngOnChanges(): void {
    this.fileName = '';
    this.fileUrl = '';
    this.saveError.set(null);
    this.success.set(null);
    this.loadEvidences();
  }

  loadEvidences(): void {
    const observationId = this.observationId;

    if (!observationId) {
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);
    this.evidences.set([]);

    this.service.getByObservationId(observationId)
      .pipe(
        finalize(() => {
          if (this.observationId === observationId) {
            this.loading.set(false);
          }
        })
      )
      .subscribe({
        next: evidences => {
          if (this.observationId === observationId) {
            this.evidences.set(
              [...evidences].sort((a, b) =>
                Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt)
              )
            );
          }
        },
        error: () => {
          if (this.observationId === observationId) {
            this.loadError.set('No se pudieron cargar las evidencias.');
          }
        }
      });
  }

  saveEvidence(): void {
    if (
      !this.observationId ||
      this.saving() ||
      this.loading() ||
      this.loadError()
    ) {
      return;
    }

    this.saveError.set(null);
    this.success.set(null);

    if (!this.fileName.trim() || !this.fileUrl.trim()) {
      this.saveError.set('Completa el nombre y el enlace.');
      return;
    }

    const observationId = this.observationId;
    let evidence: ObservationEvidence;

    try {
      evidence = new ObservationEvidence({
        id: crypto.randomUUID(),
        observationId,
        fileName: this.fileName,
        fileUrl: this.fileUrl.trim(),
        uploadedAt: new Date().toISOString()
      });
    } catch {
      this.saveError.set(
        'Revisa los datos. El enlace debe ser una URL válida con http:// o https://.'
      );
      return;
    }

    this.saving.set(true);

    this.service.create(evidence)
      .pipe(
        finalize(() => this.saving.set(false))
      )
      .subscribe({
        next: savedEvidence => {
          if (this.observationId === observationId) {
            this.evidences.update(current => [savedEvidence, ...current]);
            this.fileName = '';
            this.fileUrl = '';
            this.success.set('Evidencia registrada.');
          }
        },
        error: () => {
          if (this.observationId === observationId) {
            this.saveError.set(
              'No se pudo guardar la evidencia. Inténtalo nuevamente.'
            );
          }
        }
      });
  }
}
