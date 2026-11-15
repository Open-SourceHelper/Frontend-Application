import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom, interval, map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { UserRole } from '../../../identity-access/domain/model/user-role.enum';
import { LocalSpringApi } from '../../../shared/infrastructure/local-spring-api';

interface VisualSupport {
  id: string;
  filename: string;
}

interface Activity {
  id: string;
  title: string;
  position: number;
  durationMinutes: number;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
  transitionMinutes: number;
  alertType: 'VISUAL' | 'SOFT_SOUND';
  timerStartedAt: string | null;
  visuals: VisualSupport[];
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
export class SpringGuidanceRoutine implements OnInit, OnDestroy {
  private readonly api = inject(LocalSpringApi);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
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
  private readonly clock = toSignal(interval(1000).pipe(map(() => Date.now())), { initialValue: Date.now() });
  readonly preview = signal<{ url: string; name: string } | null>(null);

  routineTitle = '';
  routineDate = '';
  activityTitle = '';
  duration = 10;
  guidelineTitle = '';
  instructions = '';
  editingGuideline = '';
  editingActivity: Activity | null = null;
  extraActivity = { title: '', duration: 10 };
  duplicateFor = '';
  duplicateDate = '';
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

  ngOnDestroy(): void {
    this.closePreview();
  }

  createRoutine(): void {
    void this.save('POST', '/routines', {
      childId: this.childId,
      title: this.routineTitle.trim(),
      scheduledDate: this.routineDate,
      activities: [{ title: this.activityTitle.trim(), position: 1, durationMinutes: this.duration }],
    }, 'Rutina creada.', () => { this.routineTitle = ''; this.activityTitle = ''; });
  }

  duplicateRoutine(routine: Routine): void {
    void this.save('POST', '/routines/' + routine.id + '/duplicate', { scheduledDate: this.duplicateDate },
      'Rutina duplicada.', () => { this.duplicateFor = ''; this.duplicateDate = ''; });
  }

  archiveRoutine(routine: Routine): void {
    if (!window.confirm('¿Archivar esta rutina?')) return;
    void this.save('DELETE', '/routines/' + routine.id, null, 'Rutina archivada.');
  }

  addActivity(routine: Routine): void {
    const position = Math.max(0, ...routine.activities.map(activity => activity.position)) + 1;
    void this.save('POST', '/routines/' + routine.id + '/activities', {
      title: this.extraActivity.title.trim(), position, durationMinutes: this.extraActivity.duration,
    }, 'Actividad agregada.', () => { this.extraActivity = { title: '', duration: 10 }; });
  }

  removeActivity(routine: Routine, activity: Activity): void {
    void this.save('DELETE', this.activityPath(routine, activity), null, 'Actividad retirada.');
  }

  configureTimer(routine: Routine, activity: Activity, minutes: string): void {
    void this.save('PUT', this.activityPath(routine, activity) + '/timer', {
      transitionMinutes: Number(minutes), alertType: activity.alertType,
    }, 'Temporizador configurado.');
  }

  startTimer(routine: Routine, activity: Activity): void {
    void this.save('POST', this.activityPath(routine, activity) + '/timer/start', null, 'Temporizador iniciado.');
  }

  remainingSeconds(activity: Activity): number {
    if (!activity.timerStartedAt) return 0;
    const end = Date.parse(activity.timerStartedAt) + activity.transitionMinutes * 60_000;
    return Math.max(0, Math.ceil((end - Math.max(this.clock(), Date.now())) / 1000));
  }

  uploadVisual(routine: Routine, activity: Activity, input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    input.value = '';
    void this.save('POST', this.activityPath(routine, activity) + '/visual-supports', form,
      'Apoyo visual guardado.');
  }

  removeVisual(routine: Routine, activity: Activity, visual: VisualSupport): void {
    void this.save('DELETE', this.activityPath(routine, activity) + '/visual-supports/' + visual.id, null,
      'Apoyo visual retirado.', () => this.closePreview());
  }

  openVisual(routine: Routine, activity: Activity, visual: VisualSupport): void {
    void this.run(async () => {
      const path = this.activityPath(routine, activity) + '/visual-supports/' + visual.id + '/file';
      const file = await firstValueFrom(this.api.readFile(path).pipe(takeUntilDestroyed(this.destroyRef)));
      this.closePreview();
      this.preview.set({ url: URL.createObjectURL(file), name: visual.filename });
    });
  }

  closePreview(): void {
    const image = this.preview();
    if (!image) return;
    this.preview.set(null);
    URL.revokeObjectURL(image.url);
  }

  private activityPath(routine: Routine, activity: Activity): string {
    return '/routines/' + routine.id + '/activities/' + activity.id;
  }

  editActivity(activity: Activity): void {
    this.editingActivity = { ...activity };
  }

  saveActivity(routine: Routine): void {
    const activity = this.editingActivity;
    if (!activity) return;
    void this.save('PUT', this.activityPath(routine, activity), {
      title: activity.title.trim(), position: activity.position, durationMinutes: activity.durationMinutes,
    }, 'Actividad actualizada.', () => { this.editingActivity = null; });
  }

  finishActivity(routine: Routine, activity: Activity, action: 'complete' | 'skip'): void {
    const path = this.activityPath(routine, activity) + '/' + action;
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
        this.closePreview();
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
