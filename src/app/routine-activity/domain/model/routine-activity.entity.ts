import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {ActivityStatus} from './activity-status';
import {AlertType} from './alert-type';
import {Duration} from './duration';
import {VisualSupport} from './visual-support.entity';

/**
 * Represents an individual activity that belongs to a routine.
 */
export class RoutineActivity implements BaseEntity {
  #id: number;
  #routineId: number;
  #name: string;
  #description: string;
  #activityOrder: number;
  #duration: Duration;
  #status: ActivityStatus;
  #transitionDuration: Duration;
  #alertType: AlertType;
  #completedAt: Date | null;
  #visualSupports: VisualSupport[];

  /**
   * Creates a new routine activity.
   * @param props - Initialization values.
   */
  constructor(props: {
    id: number;
    routineId: number;
    name: string;
    description?: string;
    activityOrder: number;
    durationMinutes: number;
    status?: ActivityStatus;
    transitionDurationMinutes?: number;
    alertType?: AlertType;
    completedAt?: Date | null;
    visualSupports?: VisualSupport[];
  }) {
    this.#id = props.id;
    this.#routineId = props.routineId;
    this.#name = props.name;
    this.#description = props.description ?? '';
    this.#activityOrder = props.activityOrder;
    this.#duration = new Duration(props.durationMinutes);
    this.#status = props.status ?? ActivityStatus.PENDING;
    this.#transitionDuration = new Duration(props.transitionDurationMinutes ?? 1);
    this.#alertType = props.alertType ?? AlertType.VISUAL;
    this.#completedAt = props.completedAt ?? null;
    this.#visualSupports = props.visualSupports ?? [];
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get routineId(): number {
    return this.#routineId;
  }

  set routineId(value: number) {
    this.#routineId = value;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  get activityOrder(): number {
    return this.#activityOrder;
  }

  get durationMinutes(): number {
    return this.#duration.minutes;
  }

  get status(): ActivityStatus {
    return this.#status;
  }

  get transitionDurationMinutes(): number {
    return this.#transitionDuration.minutes;
  }

  get alertType(): AlertType {
    return this.#alertType;
  }

  get completedAt(): Date | null {
    return this.#completedAt;
  }

  get visualSupports(): VisualSupport[] {
    return this.#visualSupports;
  }

  set visualSupports(value: VisualSupport[]) {
    this.#visualSupports = value;
  }

  /**
   * Gets the main visual support (the first one), if any.
   */
  get mainVisualSupport(): VisualSupport | null {
    return this.#visualSupports[0] ?? null;
  }

  /**
   * Indicates if the activity is waiting to be executed.
   */
  get isPending(): boolean {
    return this.#status === ActivityStatus.PENDING;
  }

  /**
   * Validates the business rules of the activity.
   * @returns True when it has a name, a valid order and valid durations.
   */
  esValida(): boolean {
    return this.#name.trim().length > 0
      && Number.isInteger(this.#activityOrder) && this.#activityOrder > 0
      && this.#duration.esValida()
      && this.#transitionDuration.esValida();
  }

  /**
   * Marks the activity as completed and registers the time (US14).
   */
  completarActividad(): void {
    if (!this.isPending) return;
    this.#status = ActivityStatus.COMPLETED;
    this.#completedAt = new Date();
  }

  /**
   * Marks the activity as skipped (US30).
   */
  omitirActividad(): void {
    if (!this.isPending) return;
    this.#status = ActivityStatus.SKIPPED;
  }

  /**
   * Configures the alert used when the transition timer ends (US31).
   * @param type - Alert type.
   */
  configurarAlerta(type: AlertType): void {
    this.#alertType = type;
  }
}
