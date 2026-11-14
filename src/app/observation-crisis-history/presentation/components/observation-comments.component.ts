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

import { PsychologistComment } from '../../domain/model/psychologist-comment.entity';
import { PsychologistCommentService } from '../../infrastructure/services/psychologist-comment.service';

@Component({
  selector: 'app-observation-comments',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <section>
      <h3>Comentarios del psicólogo</h3>

      @if (loading()) {
        <p role="status">Cargando comentarios…</p>
      }

      @if (loadError()) {
        <p role="alert">{{ loadError() }}</p>
        <button type="button" (click)="loadComments()">
          Reintentar
        </button>
      }

      @if (!loading() && !loadError()) {
        @for (comment of comments(); track comment.id) {
          <article>
            <p>{{ comment.content }}</p>
            <small>
              {{ comment.createdAt | date:'dd/MM/yyyy HH:mm' }}
            </small>
          </article>
        } @empty {
          <p>Todavía no hay comentarios.</p>
        }
      }

      <p class="demo-note">
        Prueba con un psicólogo de demostración.
      </p>

      <form #form="ngForm" (ngSubmit)="saveComment()">
        <label [for]="'comment-' + observationId">
          Nuevo comentario
        </label>

        <textarea
          [id]="'comment-' + observationId"
          name="content"
          [(ngModel)]="content"
          rows="3"
          required
          [disabled]="saving()"
        ></textarea>

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
            !content.trim() ||
            saving() ||
            loading() ||
            !!loadError()
          "
        >
          {{ saving() ? 'Guardando…' : 'Guardar comentario' }}
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

    h3 {
      color: #5b2d91;
    }

    article {
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 8px;
      background: white;
      overflow-wrap: anywhere;
    }

    article p {
      white-space: pre-wrap;
    }

    small, .demo-note {
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

    textarea {
      padding: 12px;
      border: 1px solid #b8adc5;
      border-radius: 8px;
      font: inherit;
      resize: vertical;
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
export class ObservationCommentsComponent implements OnChanges {
  @Input({ required: true }) observationId = '';

  private readonly service = inject(PsychologistCommentService);

  readonly comments = signal<PsychologistComment[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);
  readonly success = signal<string | null>(null);

  content = '';

  ngOnChanges(): void {
    this.content = '';
    this.saveError.set(null);
    this.success.set(null);
    this.loadComments();
  }

  loadComments(): void {
    const observationId = this.observationId;

    if (!observationId) {
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);
    this.comments.set([]);

    this.service.getByObservationId(observationId)
      .pipe(
        finalize(() => {
          if (this.observationId === observationId) {
            this.loading.set(false);
          }
        })
      )
      .subscribe({
        next: comments => {
          if (this.observationId === observationId) {
            this.comments.set(
              [...comments].sort((a, b) =>
                Date.parse(b.createdAt) - Date.parse(a.createdAt)
              )
            );
          }
        },
        error: () => {
          if (this.observationId === observationId) {
            this.loadError.set('No se pudieron cargar los comentarios.');
          }
        }
      });
  }

  saveComment(): void {
    if (
      !this.content.trim() ||
      !this.observationId ||
      this.saving() ||
      this.loading() ||
      this.loadError()
    ) {
      return;
    }

    const observationId = this.observationId;

    const comment = new PsychologistComment({
      id: crypto.randomUUID(),
      observationId,
      psychologistId: 'psychologist-demo-001',
      content: this.content,
      createdAt: new Date().toISOString()
    });

    this.saving.set(true);
    this.saveError.set(null);
    this.success.set(null);

    this.service.create(comment)
      .pipe(
        finalize(() => this.saving.set(false))
      )
      .subscribe({
        next: savedComment => {
          if (this.observationId === observationId) {
            this.comments.update(current => [savedComment, ...current]);
            this.content = '';
            this.success.set('Comentario guardado.');
          }
        },
        error: () => {
          if (this.observationId === observationId) {
            this.saveError.set(
              'No se pudo guardar el comentario. Inténtalo nuevamente.'
            );
          }
        }
      });
  }
}
