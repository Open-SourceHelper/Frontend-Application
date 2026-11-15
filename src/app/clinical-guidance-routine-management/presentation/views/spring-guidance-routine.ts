import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { UserRole } from '../../../identity-access/domain/model/user-role.enum';
import { LocalSpringApi } from '../../../shared/infrastructure/local-spring-api';

interface Activity {
  id: string;
  title: string;
  position: number;
  durationMinutes: number;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
}

interface Routine {
  id: string;
  title: string;
  scheduledDate: string;
  activities: Activity[];
}

interface Guideline {
  id: string;
  title: string;
  instructions: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

interface Guide {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface Patient {
  childId: string;
}

@Component({
  imports: [FormsModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './spring-guidance-routine.html',
  styleUrls: ['./guidance-routine-overview.css', './spring-guidance-routine.css'],
})
export class SpringGuidanceRoutine implements OnInit {
  private readonly api = inject(LocalSpringApi);
  private readonly route = inject(ActivatedRoute);
  readonly childId = this.api.session?.localSpring?.childId ?? '';
  readonly professional = this.api.session?.role === UserRole.PSYCHOLOGIST;
  readonly canManage = this.professional || this.api.session?.role === UserRole.PARENT;
  readonly section = this.route.snapshot.data['section'] as string;
  readonly selectedRoutine = this.route.snapshot.paramMap.get('id');
  readonly base = '/clinical-guidance-routine-management';
  readonly busy = signal(false);
  readonly error = signal('');
  readonly feedback = signal('');
  readonly routines = signal<Routine[]>([]);
  readonly guidelines = signal<Guideline[]>([]);
  readonly guides = signal<Guide[]>([]);
  readonly patients = signal<Patient[]>([]);

  routineTitle = '';
  routineDate = '';
  activityTitle = '';
  duration = 10;
  guidelineTitle = '';
  instructions = '';
  editingGuideline = '';
  editingActivity: Activity | null = null;
  guideQuery = '';

  get displayedRoutines(): Routine[] {
    return this.selectedRoutine ? this.routines().filter(routine => routine.id === this.selectedRoutine) : this.routines();
  }

  get matchingGuides(): Guide[] {
    const term = this.guideQuery.trim().toLocaleLowerCase();
    return this.guides().filter(guide => (guide.title + ' ' + guide.category).toLocaleLowerCase().includes(term));
  }

  ngOnInit(): void {
    void this.run(() => this.load());
  }

  createRoutine(): void {
    void this.save('POST', '/routines', {
      childId: this.childId,
      title: this.routineTitle.trim(),
      scheduledDate: this.routineDate,
      activities: [{ title: this.activityTitle.trim(), position: 1, durationMinutes: this.duration }],
    }, 'Rutina creada.', () => { this.routineTitle = ''; this.activityTitle = ''; });
  }

  editActivity(activity: Activity): void {
    this.editingActivity = { ...activity };
  }

  saveActivity(routine: Routine): void {
    const activity = this.editingActivity;
    if (!activity) return;
    void this.save('PUT', '/routines/' + routine.id + '/activities/' + activity.id, {
      title: activity.title.trim(), position: activity.position, durationMinutes: activity.durationMinutes,
    }, 'Actividad actualizada.', () => { this.editingActivity = null; });
  }

  finishActivity(routine: Routine, activity: Activity, action: 'complete' | 'skip'): void {
    const path = '/routines/' + routine.id + '/activities/' + activity.id + '/' + action;
    void this.save('PATCH', path, null, action === 'complete' ? 'Actividad completada.' : 'Actividad omitida.');
  }

  saveGuideline(): void {
    const payload = { title: this.guidelineTitle.trim(), instructions: this.instructions.trim() };
    const editing = this.editingGuideline;
    void this.save(editing ? 'PUT' : 'POST', editing ? '/clinical-guidelines/' + editing : '/clinical-guidelines',
      editing ? payload : { ...payload, childId: this.childId }, 'Pauta guardada.', () => this.cancelEdit());
  }

  startEdit(guideline: Guideline): void {
    this.editingGuideline = guideline.id;
    this.guidelineTitle = guideline.title;
    this.instructions = guideline.instructions;
  }

  cancelEdit(): void {
    this.editingGuideline = '';
    this.guidelineTitle = '';
    this.instructions = '';
  }

  changeGuidelineStatus(guideline: Guideline, action: 'publish' | 'archive'): void {
    void this.save('PATCH', '/clinical-guidelines/' + guideline.id + '/' + action, null,
      action === 'publish' ? 'Pauta publicada.' : 'Pauta archivada.');
  }

  private async load(): Promise<void> {
    const query = '?childId=' + encodeURIComponent(this.childId);
    const [routines, guidelines, guides, patients] = await Promise.all([
      firstValueFrom(this.api.request<Routine[]>('GET', '/routines' + query)),
      firstValueFrom(this.api.request<Guideline[]>('GET', '/clinical-guidelines' + query)),
      firstValueFrom(this.api.request<Guide[]>('GET', '/practical-guides' + query)),
      this.professional ? firstValueFrom(this.api.request<Patient[]>('GET', '/patients')) : [],
    ]);
    this.routines.set(routines);
    this.guidelines.set(guidelines);
    this.guides.set(guides);
    this.patients.set(patients);
  }

  private async save(method: string, path: string, body: unknown, message: string, reset?: () => void): Promise<void> {
    await this.run(async () => {
      await firstValueFrom(this.api.request(method, path, body));
      reset?.();
      await this.load();
      this.feedback.set(message);
    });
  }

  private async run(action: () => Promise<void>): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.feedback.set('');
    try {
      await action();
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.routines.set([]);
        this.guidelines.set([]);
        this.guides.set([]);
        this.patients.set([]);
        this.error.set('Tu cuenta no tiene acceso a las orientaciones y rutinas de este perfil.');
      } else {
        this.error.set(error instanceof HttpErrorResponse && error.error?.message
          ? error.error.message : 'No se pudo completar la operación. Inténtalo de nuevo.');
      }
    } finally {
      this.busy.set(false);
    }
  }
}
