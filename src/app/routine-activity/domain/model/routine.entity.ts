import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {RoutineStatus} from './routine-status';
import {RoutineActivity} from './routine-activity.entity';

/**
 * Routine aggregate root. Manages the ordered set of activities of a child's day.
 *
 * @remarks
 * childId is a reference by identifier to the Child aggregate of
 * Child Profile Management (BC02); the child entity is not duplicated here.
 */
export class Routine implements BaseEntity {
  #id: number;
  #childId: string;
  #originalRoutineId: number | null;
  #name: string;
  #description: string;
  #status: RoutineStatus;
  #createdAt: Date;
  #activities: RoutineActivity[];

  /**
   * Creates a new routine.
   * @param props - Initialization values.
   */
  constructor(props: {
    id: number;
    childId: string;
    originalRoutineId?: number | null;
    name: string;
    description?: string;
    status?: RoutineStatus;
    createdAt?: Date;
    activities?: RoutineActivity[];
  }) {
    this.#id = props.id;
    this.#childId = props.childId;
    this.#originalRoutineId = props.originalRoutineId ?? null;
    this.#name = props.name;
    this.#description = props.description ?? '';
    this.#status = props.status ?? RoutineStatus.ACTIVE;
    this.#createdAt = props.createdAt ?? new Date();
    this.#activities = props.activities ?? [];
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get childId(): string {
    return this.#childId;
  }

  get originalRoutineId(): number | null {
    return this.#originalRoutineId;
  }

  get name(): string {
    return this.#name;
  }

  get description(): string {
    return this.#description;
  }

  get status(): RoutineStatus {
    return this.#status;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get activities(): RoutineActivity[] {
    return this.#activities;
  }

  set activities(value: RoutineActivity[]) {
    this.#activities = value;
  }

  /**
   * Total estimated duration of the routine, in minutes.
   */
  get totalMinutes(): number {
    return this.#activities.reduce((total, activity) => total + activity.durationMinutes, 0);
  }

  /**
   * Indicates if the routine can be removed (US29: only inactive routines).
   */
  get canBeDeleted(): boolean {
    return this.#status === RoutineStatus.INACTIVE;
  }

  /**
   * Adds an activity to the routine.
   * @param activity - Activity to add.
   */
  agregarActividad(activity: RoutineActivity): void {
    activity.routineId = this.#id;
    this.#activities = [...this.#activities, activity];
  }

  /**
   * Returns the activities sorted by their order (US13).
   */
  consultarActividades(): RoutineActivity[] {
    return [...this.#activities].sort((a, b) => a.activityOrder - b.activityOrder);
  }

  /**
   * Validates the creation rules of US15: a name, a child and at least one valid activity.
   * Activity orders must not be repeated.
   */
  esValida(): boolean {
    const orders = this.#activities.map(activity => activity.activityOrder);
    return this.#name.trim().length > 0
      && this.#childId.trim().length > 0
      && this.#activities.length > 0
      && this.#activities.every(activity => activity.esValida())
      && new Set(orders).size === orders.length;
  }

  /**
   * Creates an exact copy of the routine in DRAFT status (US28).
   * @returns The duplicated routine (without identifiers, to be assigned by the API).
   */
  duplicarRutina(): Routine {
    return new Routine({
      id: 0,
      childId: this.#childId,
      originalRoutineId: this.#id,
      name: `${this.#name} (copia)`,
      description: this.#description,
      status: RoutineStatus.DRAFT,
      activities: this.consultarActividades().map(activity => new RoutineActivity({
        id: 0,
        routineId: 0,
        name: activity.name,
        description: activity.description,
        activityOrder: activity.activityOrder,
        durationMinutes: activity.durationMinutes,
        transitionDurationMinutes: activity.transitionDurationMinutes,
        alertType: activity.alertType
      }))
    });
  }

  /**
   * Activates the routine so it can be executed.
   */
  activar(): void {
    this.#status = RoutineStatus.ACTIVE;
  }

  /**
   * Inactivates the routine (US46: DELETE changes the status to inactive).
   */
  desactivar(): void {
    this.#status = RoutineStatus.INACTIVE;
  }
}
