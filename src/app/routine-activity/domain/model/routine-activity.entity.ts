import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { ActivityStatus } from './activity-status';
import { AlertType } from './alert-type';
import { Duration } from './duration';
import { VisualSupport } from './visual-support.entity';

/**
 * Represents an activity belonging to a routine.
 */
export class RoutineActivity implements BaseEntity {
  #id: number;
  #routineId: number;
  #title: string;
  #order: number;
  #duration: Duration;
  #status: ActivityStatus;
  #timerEnabled: boolean;
  #alertType: AlertType;
  #visualSupport?: VisualSupport;

  constructor(
    id: number,
    routineId: number,
    title: string,
    order: number,
    duration: Duration,
    status: ActivityStatus = ActivityStatus.PENDING,
    timerEnabled: boolean = false,
    alertType: AlertType = AlertType.VISUAL,
    visualSupport?: VisualSupport
  ) {
    this.#id = id;
    this.#routineId = routineId;
    this.#title = title;
    this.#order = order;
    this.#duration = duration;
    this.#status = status;
    this.#timerEnabled = timerEnabled;
    this.#alertType = alertType;
    this.#visualSupport = visualSupport;
  }

  get id(): number {
    return this.#id;
  }

  get routineId(): number {
    return this.#routineId;
  }

  get title(): string {
    return this.#title;
  }

  get order(): number {
    return this.#order;
  }

  get duration(): Duration {
    return this.#duration;
  }

  get status(): ActivityStatus {
    return this.#status;
  }

  get timerEnabled(): boolean {
    return this.#timerEnabled;
  }

  get alertType(): AlertType {
    return this.#alertType;
  }

  get visualSupport(): VisualSupport | undefined {
    return this.#visualSupport;
  }

  iniciar(): void {
    this.#status = ActivityStatus.IN_PROGRESS;
  }

  completar(): void {
    this.#status = ActivityStatus.COMPLETED;
  }

  omitir(): void {
    this.#status = ActivityStatus.SKIPPED;
  }
}
