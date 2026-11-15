import { PublicDemoSnapshot, PublicSpringDemo } from '../../../shared/infrastructure/public-spring-demo';
import { toObservation, toComments } from '../../infrastructure/resources/spring-episode';
import { exampleChild, exampleEpisodes } from './public-history-examples';
import { DatePipe } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, firstValueFrom, forkJoin, of } from 'rxjs';
import { CrisisSeverity } from '../../domain/model/crisis-severity.enum';
import { Observation } from '../../domain/model/observation.entity';
import { ClosedAlert, HistoryContextService } from '../../infrastructure/services/history-context.service';
import { ObservationService } from '../../infrastructure/services/observation.service';
import { ObservationCommentsComponent } from '../components/observation-comments.component';

@Component({
  selector: 'app-episode-history',
  imports: [DatePipe, FormsModule, ObservationCommentsComponent],
  templateUrl: './episode-history.html',
  styleUrl: './episode-history.css',
})
export class EpisodeHistory implements OnInit {
  private readonly context = inject(HistoryContextService);
  private readonly observations = inject(ObservationService);
  private readonly publishedDemo = inject(PublicSpringDemo);
  readonly publicSnapshot = signal<PublicDemoSnapshot | null>(null);
  private publicError = false;
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly registrationDialog = viewChild<ElementRef<HTMLDialogElement>>('registrationDialog');
  private readonly detailsDialog = viewChild<ElementRef<HTMLDialogElement>>('detailsDialog');

  constructor() {
    effect(() => this.showDialog(this.registrationDialog()?.nativeElement, this.step() > 0));
    effect(() => this.showDialog(this.detailsDialog()?.nativeElement, this.selected() !== null));
  }

  dismissRegistration() {
    this.step.set(0);
    this.error.set('');
  }

  dismissDetails() {
    this.selected.set(null);
    this.error.set('');
  }

  private showDialog(dialog: HTMLDialogElement | undefined, open: boolean) {
    if (!dialog || dialog.open === open) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }

  readonly user = signal(this.context.currentUser());
  readonly professional = computed(() => this.user()?.role === this.context.roles.PSYCHOLOGIST);
  readonly publicDemo = this.user()?.publicDemo === true;
  readonly demo = this.context.demo || this.publicDemo;
  readonly spring = this.user()?.localSpring !== undefined;
  private readonly exampleProfile = signal('familia');
  readonly activeDemoProfile = computed(() => this.publicDemo
    ? this.exampleProfile()
    : this.user()?.localSpring?.profile ?? this.user()?.email.split('@')[0]);
  readonly profiles = [
    { key: 'familia', label: 'Familia' },
    { key: 'cuidador', label: 'Cuidador autorizado' },
    { key: 'psicologa', label: 'Psicóloga' },
    ...(this.spring ? [] : [{ key: 'retirado', label: 'Acceso retirado' }]),
  ];
  readonly recentCrises = computed(() => {
    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return this.records().filter(record => record.isCrisis && Date.parse(record.occurredAt) >= start.getTime());
  });
  readonly crisisCount = computed(() => this.recentCrises().length);
  readonly mostCommonTrigger = computed(() => this.mostCommon(this.recentCrises().map(record => record.trigger)));
  readonly mostHelpful = computed(() => this.mostCommon(this.recentCrises().map(record => record.helped)));

  private mostCommon(values: (string | undefined)[]) {
    const counts = new Map<string, { label: string; count: number }>();
    for (const value of values) {
      const label = value?.trim();
      if (!label) continue;
      const key = label.toLocaleLowerCase('es-PE');
      const entry = counts.get(key);
      counts.set(key, { label: entry?.label ?? label, count: (entry?.count ?? 0) + 1 });
    }
    return [...counts.values()].sort((a, b) => b.count - a.count)[0];
  }
  readonly month = signal('');
  readonly monthlyEpisodes = computed(() => {
    const today = new Date();
    const formatter = new Intl.DateTimeFormat('es-PE', { month: 'short', year: 'numeric' });
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
      const key = this.localDate(date).slice(0, 7);
      const records = this.records().filter(record =>
        record.isCrisis && this.localDate(new Date(record.occurredAt)).startsWith(key)
      );
      const bySeverity = this.levels.map(level => ({
        ...level,
        count: records.filter(record => record.crisisSeverity === level.value).length,
      }));
      return { key, label: formatter.format(date), count: records.length, bySeverity };
    });
  });
  readonly weeklyEpisodes = computed(() => {
    const month = this.month();
    if (!month) return [];
    const [year, monthNumber] = month.split('-').map(Number);
    const lastDay = new Date(year, monthNumber, 0).getDate();
    const firstDay = new Date(year, monthNumber - 1, 1).getDay();
    const records = this.records().filter(record =>
      record.isCrisis && this.localDate(new Date(record.occurredAt)).startsWith(month)
    );
    const weeks = [];
    let end = 7 - ((firstDay + 6) % 7);
    for (let start = 1; start <= lastDay; start = end + 1, end += 7) {
      const last = Math.min(end, lastDay);
      const count = records.filter(record => {
        const day = new Date(record.occurredAt).getDate();
        return day >= start && day <= last;
      }).length;
      weeks.push({ start, label: start === last ? String(start) : start + '–' + last, count });
    }
    return weeks;
  });
  readonly weeklyPeak = computed(() => Math.max(1, ...this.weeklyEpisodes().map(week => week.count)));
  readonly peak = computed(() => Math.max(1, ...this.monthlyEpisodes().map(month => month.count)));
  readonly reviewCount = computed(() => this.records().filter(record => !record.reviewedAt).length);
  readonly averageDuration = computed(() => {
    const durations = this.recentCrises().flatMap(record => record.durationMinutes ? [record.durationMinutes] : []);
    return durations.length ? Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length) : null;
  });

  async switchProfile(profile: string) {
    if (!this.demo || this.busy() || !this.profiles.some(item => item.key === profile)) return;
    if (this.publicDemo) {
      this.exampleProfile.set(profile);
      this.filter.set('all');
      this.month.set('');
      this.showExampleHistory();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      const user = this.spring
        ? await firstValueFrom(this.context.switchLocalProfile(profile))
        : await firstValueFrom(this.context.signInForDemo(profile));
      if (!user) return;
      if ('password' in user) this.context.saveDemoSession(user);
      this.user.set(user);
      this.message.set('');
      this.filter.set('all');
      this.month.set('');
      this.children.set([]);
      const child = this.context.currentUser()?.localSpring?.childId ?? (this.childId || 'child-001');
      await this.initialize(child);
    } catch {
      this.error.set('No pudimos abrir el perfil de prueba. Comprueba que el servidor local esté corriendo.');
    } finally {
      this.busy.set(false);
    }
  }
  readonly children = signal<{ id: string; firstName: string; lastName: string }[]>([]);
  readonly records = signal<Observation[]>([]);
  readonly alerts = signal<ClosedAlert[]>([]);
  readonly pending = computed(() => this.alerts().filter(alert =>
    !this.records().some(record => record.alertId === alert.id)));
  readonly visible = computed(() => this.records().filter(record =>
    (!this.month() || this.localDate(new Date(record.occurredAt)).startsWith(this.month())) &&
    (this.filter() === 'all' || (this.filter() === 'crisis' && record.isCrisis)
      || (this.filter() === 'pending' && !record.reviewedAt))));
  readonly filter = signal('all');
  readonly selected = signal<Observation | null>(null);
  readonly step = signal(0);
  readonly busy = signal(false);
  readonly denied = signal(false);
  readonly message = signal('');
  readonly error = signal('');
  readonly levels = [
    { value: CrisisSeverity.Mild, label: 'Leve', face: '🙂' },
    { value: CrisisSeverity.Moderate, label: 'Moderada', face: '😟' },
    { value: CrisisSeverity.Severe, label: 'Severa', face: '😣' },
  ];
  childId = '';
  draft = this.newDraft();

  ngOnInit() {
    if (this.publicDemo) return this.loadPublicHistory();
    return this.initialize(this.route.snapshot.queryParamMap.get('childId'));
  }

  async loadPublicHistory(): Promise<void> {
    this.busy.set(true);
    this.error.set('');
    this.publicError = false;
    try {
      this.publicSnapshot.set(await firstValueFrom(this.publishedDemo.snapshot));
      this.showExampleHistory();
    } catch {
      this.publicSnapshot.set(null);
      this.records.set([]);
      this.children.set([]);
      this.selected.set(null);
      this.childId = '';
      this.publicError = true;
      this.error.set('No se pudo consultar la demo de Spring Boot.');
    } finally {
      this.busy.set(false);
    }
  }

  publicComments(episodeId: string) {
    const episode = this.publicSnapshot()?.episodes.find(item => item.id === episodeId);
    return episode ? toComments(episode) : [];
  }

  private showExampleHistory(): void {
    if (this.publicError) return;
    const snapshot = this.publicSnapshot();
    const child = snapshot?.child ?? exampleChild;
    const allowed = this.exampleProfile() !== 'retirado';
    this.denied.set(!allowed);
    this.selected.set(null);
    this.children.set(allowed ? [child] : []);
    this.childId = allowed ? child.id : '';
    this.records.set(allowed ? snapshot?.episodes.map(toObservation) ?? exampleEpisodes() : []);
  }

  private async initialize(requested: string | null) {
    if (!this.user()) return;
    this.records.set([]);
    this.alerts.set([]);
    this.selected.set(null);
    this.step.set(0);
    this.denied.set(false);
    this.childId = '';
    this.busy.set(true);
    try {
      const children = await firstValueFrom(this.context.availableChildren());
      const checks = children.map(child => this.context.canAccess(String(child.id)));
      const allowed = checks.length ? await firstValueFrom(forkJoin(checks)) : [];
      this.children.set(children.filter((_, index) => allowed[index]));
      this.childId = requested ?? String(this.children()[0]?.id ?? '');
      if (this.childId) await this.load();
      if (this.denied()) return;
      const alertId = this.route.snapshot.queryParamMap.get('alertId');
      const existing = alertId ? this.records().find(record => record.alertId === alertId) : undefined;
      if (existing) {
        this.selected.set(existing);
        return;
      }
      const alert = this.pending().find(item => item.id === alertId);
      if (!this.professional() && (alert || (!alertId && this.route.snapshot.url.at(-1)?.path === 'new'))) {
        this.begin(alert);
      }
    } catch {
      this.error.set('No pudimos cargar el historial. Vuelve a intentarlo.');
    } finally {
      this.busy.set(false);
    }
  }

  async load() {
    if (this.publicDemo) return;
    this.busy.set(true);
    this.records.set([]);
    this.alerts.set([]);
    this.selected.set(null);
    this.step.set(0);
    this.error.set('');
    try {
      if (!await this.checkAccess()) return;
      const [records, alerts] = await firstValueFrom(forkJoin([
        this.observations.getByChildId(this.childId),
        this.context.closedAlerts(this.childId).pipe(catchError(() => of([]))),
      ]));
      this.records.set(records.sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt)));
      this.alerts.set(alerts);
    } catch {
      this.error.set('No pudimos cargar el historial. Vuelve a intentarlo.');
    } finally {
      this.busy.set(false);
    }
  }

  begin(alert?: ClosedAlert) {
    this.draft = this.newDraft();
    if (alert) {
      const time = new Date(alert.createdAt);
      this.draft.occurredAt = this.localDate(time);
      this.draft.description = alert.description;
      this.draft.alertId = alert.id;
      this.draft.durationMinutes = Math.max(1, Math.round((Date.parse(alert.closedAt) - time.getTime()) / 60000));
      this.draft.crisis = true;
    }
    this.error.set('');
    this.selected.set(null);
    this.step.set(1);
  }

  async save() {
    const user = this.user();
    if (this.busy() || !user || this.professional()) return;
    const draft = this.draft;
    const time = new Date(draft.occurredAt);
    if (!draft.description.trim() || !Number.isFinite(time.getTime()) || time.getTime() > Date.now()
      || (draft.crisis && (!draft.severity || (draft.durationMinutes !== null
        && (!Number.isInteger(draft.durationMinutes) || draft.durationMinutes < 1))))) {
      this.error.set('Revisa la descripción, la fecha, la intensidad y la duración.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      if (!await this.checkAccess()) return;
      const id = draft.alertId ? 'episode-' + draft.alertId : draft.id;
      const records = await firstValueFrom(this.observations.getByChildId(this.childId));
      if (!records.some(record => record.id === id || (draft.alertId && record.alertId === draft.alertId))) {
        await firstValueFrom(this.observations.create(new Observation({
          id, childId: this.childId, caregiverId: user.id, alertId: draft.alertId,
          description: draft.description, occurredAt: time.toISOString(),
          crisisSeverity: draft.crisis ? draft.severity || null : null,
          durationMinutes: draft.crisis ? draft.durationMinutes ?? undefined : undefined,
          trigger: draft.trigger.trim() || undefined, helped: draft.helped.trim() || undefined,
        })));
      }
      this.step.set(0);
      if (this.route.snapshot.url.at(-1)?.path === 'new') {
        await this.router.navigate(['/observations'], { queryParams: { childId: this.childId } });
      } else {
        await this.load();
        if (!this.denied() && !this.error()) this.message.set('Registro guardado en el historial.');
      }
    } catch {
      this.error.set('No pudimos guardar el registro. Tus respuestas siguen aquí.');
    } finally {
      this.busy.set(false);
    }
  }

  async review(record: Observation) {
    const user = this.user();
    if (this.busy() || !this.professional() || !user) return;
    this.busy.set(true);
    this.error.set('');
    try {
      if (!await this.checkAccess()) return;
      const latest = await firstValueFrom(this.observations.getById(record.id, this.childId));
      if (latest.childId !== this.childId) return;
      const reviewed = latest.reviewedAt ? latest : await firstValueFrom(this.observations.review(new Observation({
        ...latest, reviewedAt: new Date().toISOString(), reviewedBy: user.id,
      })));
      this.records.update(items => items.map(item => item.id === reviewed.id ? reviewed : item));
      this.selected.set(reviewed);
      this.message.set('Registro marcado como revisado.');
    } catch {
      this.error.set('No pudimos marcar el registro como revisado.');
    } finally {
      this.busy.set(false);
    }
  }

  private async checkAccess() {
    const allowed = await firstValueFrom(this.context.canAccess(this.childId));
    this.denied.set(!allowed);
    if (!allowed) {
      this.records.set([]);
      this.alerts.set([]);
      this.selected.set(null);
      this.step.set(0);
    }
    return allowed;
  }

  private newDraft() {
    return {
      id: crypto.randomUUID(), alertId: undefined as string | undefined,
      occurredAt: this.localDate(new Date()), description: '', crisis: false,
      severity: '' as CrisisSeverity | '', durationMinutes: null as number | null,
      trigger: '', helped: '',
    };
  }

  private localDate(date: Date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
}
