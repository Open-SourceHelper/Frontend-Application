import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';

type Role = 'FAMILY' | 'CAREGIVER' | 'PSYCHOLOGIST';

interface Session {
  childId: number;
  role: Role;
}

interface Child {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface ClinicalProfile {
  specialNeeds: string;
  triggers: string;
  regulators: string;
}

interface CareNetwork {
  members: { id: number; caregiverId: number; status: string }[];
}

interface Alert {
  id: string;
  description: string | null;
  status: 'ACTIVE' | 'ATTENDED' | 'CLOSED';
}

interface Activity {
  id: string;
  title: string;
  status: string;
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
  status: string;
}

interface Episode {
  id: string;
  alertId: string | null;
  description: string;
  reviewedAt: string | null;
  comments: { id: string; text: string }[];
}

@Component({
  imports: [FormsModule, RouterLink],
  templateUrl: './local-api.html',
  styleUrl: './local-api.css',
})
export class LocalApi {
  private readonly http = inject(HttpClient);
  private readonly api = '/api/v1';

  private authorization = '';
  readonly accounts = [
    { name: 'Familia', id: '7001' },
    { name: 'Cuidador', id: '7002' },
    { name: 'Psicóloga', id: '7003' },
  ];

  readonly labels: Record<Role, string> = {
    FAMILY: 'Familia',
    CAREGIVER: 'Cuidador',
    PSYCHOLOGIST: 'Psicóloga',
  };
  readonly session = signal<Session | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly message = signal('');

  child: Child | null = null;
  clinical: ClinicalProfile | null = null;
  network: CareNetwork | null = null;
  alerts: Alert[] = [];
  routines: Routine[] = [];
  guidelines: Guideline[] = [];
  episodes: Episode[] = [];

  alertText = '';
  routineTitle = '';
  activityTitle = '';
  routineDate = '';
  guidelineTitle = '';
  guidelineText = '';
  episodeText = '';
  linkedAlertId = '';
  severity = '';
  comments: Record<string, string> = {};

  get childPath(): string {
    return '/children/' + this.session()?.childId;
  }

  async signIn(accountId: string): Promise<void> {
    await this.run(async () => {
      this.session.set(null);
      this.clearRecords();
      this.authorization = 'Basic ' + btoa(accountId + ':demo123');
      const session = await this.request<Session>('GET', '/local-demo/session');
      this.session.set(session);
      await this.load();
    });
  }

  refresh(): void {
    void this.run(() => this.load());
  }

  saveChild(): void {
    if (this.child) this.change('PUT', this.childPath, this.child, 'Perfil infantil guardado.');
  }

  saveClinical(): void {
    if (this.clinical) {
      this.change('PUT', this.childPath + '/clinical-profile', this.clinical, 'Perfil clínico guardado.');
    }
  }

  activateAlert(): void {
    const childId = String(this.session()?.childId);
    const description = this.alertText.trim();
    this.change('POST', '/crisis-alerts', { childId, description }, 'Alerta creada.',
      () => { this.alertText = ''; });
  }

  advanceAlert(alert: Alert): void {
    const action = alert.status === 'ACTIVE' ? 'attend' : 'close';
    this.change('PATCH', '/crisis-alerts/' + alert.id + '/' + action, null,
      action === 'attend' ? 'Alerta atendida.' : 'Alerta cerrada.');
  }

  createRoutine(): void {
    this.change('POST', '/routines', {
      childId: String(this.session()?.childId),
      title: this.routineTitle.trim(),
      scheduledDate: this.routineDate,
      activities: [{ title: this.activityTitle.trim(), position: 1, durationMinutes: 10 }],
    }, 'Rutina creada.', () => { this.routineTitle = ''; this.activityTitle = ''; });
  }

  completeActivity(routine: Routine, activity: Activity): void {
    this.change('PATCH', '/routines/' + routine.id + '/activities/' + activity.id + '/complete',
      null, 'Actividad completada.');
  }

  createGuideline(): void {
    this.change('POST', '/clinical-guidelines', {
      childId: String(this.session()?.childId),
      title: this.guidelineTitle.trim(),
      instructions: this.guidelineText.trim(),
    }, 'Pauta guardada.', () => { this.guidelineTitle = ''; this.guidelineText = ''; });
  }

  publishGuideline(guideline: Guideline): void {
    this.change('PATCH', '/clinical-guidelines/' + guideline.id + '/publish', null, 'Pauta publicada.');
  }

  createEpisode(): void {
    const alertId = this.linkedAlertId || null;
    this.change('POST', this.childPath + '/episodes', {
      description: this.episodeText.trim(),
      occurredAt: new Date().toISOString(),
      alertId,
      crisisSeverity: alertId ? this.severity : null,
    }, 'Episodio guardado.', () => { this.episodeText = ''; this.linkedAlertId = ''; this.severity = ''; });
  }

  comment(episode: Episode): void {
    this.change('POST', this.childPath + '/episodes/' + episode.id + '/comments', {
      text: this.comments[episode.id]?.trim(),
    }, 'Comentario guardado.', () => { this.comments[episode.id] = ''; });
  }

  review(episode: Episode): void {
    this.change('PUT', this.childPath + '/episodes/' + episode.id + '/review', null, 'Episodio revisado.');
  }

  private async load(): Promise<void> {
    const session = this.session();
    if (!session) return;
    const child = this.childPath;
    const query = '?childId=' + session.childId;
    const [profile, clinical, network, alerts, routines, guidelines, episodes] = await Promise.all([
      session.role === 'PSYCHOLOGIST' ? null : this.request<Child>('GET', child),
      session.role === 'PSYCHOLOGIST' ? null : this.request<ClinicalProfile>('GET', child + '/clinical-profile'),
      session.role === 'FAMILY' ? this.request<CareNetwork>('GET', child + '/care-network') : null,
      session.role === 'PSYCHOLOGIST' ? [] : this.request<Alert[]>('GET', '/crisis-alerts' + query),
      this.request<Routine[]>('GET', '/routines' + query),
      this.request<Guideline[]>('GET', '/clinical-guidelines' + query),
      this.request<Episode[]>('GET', child + '/episodes'),
    ]);
    this.child = profile;
    this.clinical = clinical;
    this.network = network;
    this.alerts = alerts;
    this.routines = routines;
    this.guidelines = guidelines;
    this.episodes = episodes;
  }

  private clearRecords(): void {
    this.child = null;
    this.clinical = null;
    this.network = null;
    this.alerts = [];
    this.routines = [];
    this.guidelines = [];
    this.episodes = [];
    this.comments = {};
    this.linkedAlertId = '';
  }

  private change(method: string, path: string, body: unknown, message: string, reset?: () => void): void {
    void this.run(async () => {
      await this.request(method, path, body);
      reset?.();
      await this.load();
      this.message.set(message);
    });
  }

  private async run(action: () => Promise<void>): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    try {
      await action();
    } catch (error) {
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        this.clearRecords();
      }
      this.error.set(this.errorText(error));
    } finally {
      this.busy.set(false);
    }
  }

  private request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const result: Observable<T> = this.http.request<T>(method, this.api + path, {
      body,
      headers: { Authorization: this.authorization },
      timeout: 10000,
    });
    return firstValueFrom(result);
  }

  private errorText(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) return 'No se pudo completar la operación.';
    if (!error.status || error.status === 502 || error.status === 504 || error.status === 500 && !error.error?.detail && !error.error?.message) return 'No se pudo conectar a Spring Boot. Revisa que esté corriendo en el puerto 8080.';
    if (error.status === 401) return 'La API rechazó las credenciales de prueba.';
    if (error.status === 403) return 'Esta cuenta no tiene permiso para realizar la operación.';
    return error.error?.message || error.error?.detail || 'La API respondió con el código ' + error.status + '.';
  }
}
