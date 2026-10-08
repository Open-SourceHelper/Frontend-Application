import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { RoutineStatus } from './routine-status';
import { RoutineActivity } from './routine-activity.entity';

/**
 * Represents a routine composed of multiple activities.
 */
export class Routine implements BaseEntity {
  #id: number;
  #childId: number;
  #name: string;
  #status: RoutineStatus;
  #activities: RoutineActivity[];

  constructor(
    id: number,
    childId: number,
    name: string,
    status: RoutineStatus = RoutineStatus.DRAFT,
    activities: RoutineActivity[] = []
  ) {
    this.#id = id;
    this.#childId = childId;
    this.#name = name;
    this.#status = status;
    this.#activities = activities;
  }

  get id(): number {
    return this.#id;
  }

  get childId(): number {
    return this.#childId;
  }

  get name(): string {
    return this.#name;
  }

  get status(): RoutineStatus {
    return this.#status;
  }

  get activities(): RoutineActivity[] {
    return [...this.#activities];
  }

  agregarActividad(activity: RoutineActivity): void {
    this.#activities.push(activity);
  }

  activar(): void {
    this.#status = RoutineStatus.ACTIVE;
  }

  completar(): void {
    this.#status = RoutineStatus.COMPLETED;
  }

  desactivar(): void {
    this.#status = RoutineStatus.INACTIVE;
  }
}
