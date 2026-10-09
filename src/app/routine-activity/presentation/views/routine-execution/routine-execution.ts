import {Component, computed, DestroyRef, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatError} from '@angular/material/form-field';
import {RoutineActivityStore} from '../../../application/routine-activity.store';
import {RoutineActivity} from '../../../domain/model/routine-activity.entity';
import {ActivityStatus} from '../../../domain/model/activity-status';
import {AlertType} from '../../../domain/model/alert-type';

/**
 * Guides the caregiver through the daily sequence of a routine
 * (US13 visualización, US14 completar, US16 temporizador, US30 omitir, US31 tipo de alerta).
 */
@Component({
  selector: 'app-routine-execution',
  imports: [DatePipe, MatButtonModule, MatButtonToggleModule, MatCardModule, MatIcon, MatProgressBar, MatError],
  templateUrl: './routine-execution.html',
  styleUrls: ['../../routine-theme.css', './routine-execution.css']
})
export class RoutineExecution {
  readonly store = inject(RoutineActivityStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly ActivityStatus = ActivityStatus;
  protected readonly AlertType = AlertType;

  /**
   * Routine being executed.
   */
  readonly routine = this.store.getRoutineById(+this.route.snapshot.paramMap.get('id')!);

  /**
   * Activities in chronological order (US13).
   */
  readonly activities = computed(() => this.routine()?.consultarActividades() ?? []);

  /**
   * First pending activity: the one the child is doing now.
   */
  readonly current = computed(() => this.activities().find(activity => activity.isPending) ?? null);

  /**
   * Activity that comes after the current one ("Después sigue").
   */
  readonly next = computed(() => {
    const current = this.current();
    return current ? this.activities().find(a => a.isPending && a !== current) ?? null : null;
  });

  /**
   * Number of activities already completed.
   */
  readonly completedCount = computed(() =>
    this.activities().filter(a => a.status === ActivityStatus.COMPLETED).length);

  /**
   * Today's date written in Spanish, e.g. "jueves, 8 de octubre".
   */
  readonly today = new Intl.DateTimeFormat('es', {weekday: 'long', day: 'numeric', month: 'long'}).format(new Date());

  /**
   * True while the transition timer is paused.
   */
  readonly paused = signal(false);

  /**
   * Percentage of activities already completed or skipped.
   */
  readonly progress = computed(() => {
    const total = this.activities().length;
    return total ? Math.round(100 * this.activities().filter(a => !a.isPending).length / total) : 0;
  });

  /**
   * Seconds left in the transition timer (null when it is not running).
   */
  readonly remainingSeconds = signal<number | null>(null);

  /**
   * True when the timer reached zero and the alert is being shown.
   */
  readonly alertActive = signal(false);

  private timerId: ReturnType<typeof setInterval> | null = null;
  private timerTotal = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopTimer());
  }

  /**
   * Formats the remaining time as mm:ss.
   */
  readonly remainingLabel = computed(() => {
    const seconds = this.remainingSeconds() ?? 0;
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  });

  /**
   * Percentage of the timer already consumed.
   */
  readonly timerProgress = computed(() =>
    this.timerTotal ? Math.round(100 * (this.remainingSeconds() ?? 0) / this.timerTotal) : 0);

  /**
   * Starts the countdown of the transition timer (US16).
   * @param activity - Current activity.
   */
  startTimer(activity: RoutineActivity): void {
    this.stopTimer();
    this.timerTotal = activity.transitionDurationMinutes * 60;
    this.remainingSeconds.set(this.timerTotal);
    this.runTimer(activity);
  }

  /**
   * Pauses or resumes the transition timer.
   * @param activity - Current activity.
   */
  togglePause(activity: RoutineActivity): void {
    if (this.paused()) {
      this.paused.set(false);
      this.runTimer(activity);
    } else {
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = null;
      this.paused.set(true);
    }
  }

  /**
   * Starts the countdown interval from the current remaining time.
   */
  private runTimer(activity: RoutineActivity): void {
    this.timerId = setInterval(() => {
      const next = (this.remainingSeconds() ?? 0) - 1;
      this.remainingSeconds.set(Math.max(next, 0));
      if (next <= 0) {
        this.stopTimer();
        this.raiseAlert(activity.alertType);
      }
    }, 1000);
  }

  /**
   * Stops the timer and clears the alert.
   */
  stopTimer(): void {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = null;
    this.remainingSeconds.set(null);
    this.alertActive.set(false);
    this.paused.set(false);
  }

  /**
   * Indicates if the timer screen (running, paused or alerting) must be shown.
   */
  readonly timerVisible = computed(() => this.remainingSeconds() !== null || this.alertActive());

  /**
   * Stroke offset of the circular timer (full circle = 2πr with r = 88).
   */
  readonly ringOffset = computed(() => {
    const circumference = 2 * Math.PI * 88;
    return circumference * (1 - this.timerProgress() / 100);
  });

  /**
   * Duplicates the routine being executed (US28).
   */
  duplicate(id: number): void {
    this.store.duplicateRoutine(id);
    this.back();
  }

  /**
   * Marks the activity as completed (US14).
   */
  complete(activity: RoutineActivity): void {
    this.stopTimer();
    this.store.completeActivity(activity.routineId, activity.id);
  }

  /**
   * Marks the activity as skipped and moves to the next one (US30).
   */
  skip(activity: RoutineActivity): void {
    this.stopTimer();
    this.store.skipActivity(activity.routineId, activity.id);
  }

  /**
   * Changes the alert type of the activity timer (US31).
   */
  changeAlert(activity: RoutineActivity, type: AlertType): void {
    this.store.configureAlert(activity.routineId, activity.id, type);
  }

  /**
   * Returns to the routine list.
   */
  back(): void {
    this.router.navigate(['routine-activity/routines']).then();
  }

  /**
   * Shows the alert: always a color change; a short, low-volume tone only for SOFT_SOUND.
   */
  private raiseAlert(type: AlertType): void {
    this.alertActive.set(true);
    if (type !== AlertType.SOFT_SOUND) return;
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 440;
      gain.gain.setValueAtTime(0.05, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.2);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 1.2);
    } catch {
      // Audio not available: the visual alert is still shown.
    }
  }
}
