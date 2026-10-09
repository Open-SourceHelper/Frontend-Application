import { AssignmentStatus } from './assignment-status';

/**
 * Represents the assignment of a child to a psychologist.
 */
export class PatientAssignment {
  #id: string;
  #psychologistId: string;
  #childId: string;
  #status: AssignmentStatus;
  #assignedAt: Date;

  constructor(
    id: string,
    psychologistId: string,
    childId: string,
    status: AssignmentStatus = AssignmentStatus.INACTIVE,
    assignedAt: Date = new Date()
  ) {
    this.#id = id;
    this.#psychologistId = psychologistId;
    this.#childId = childId;
    this.#status = status;
    this.#assignedAt = assignedAt;
  }

  get id(): string {
    return this.#id;
  }

  get psychologistId(): string {
    return this.#psychologistId;
  }

  get childId(): string {
    return this.#childId;
  }

  get status(): AssignmentStatus {
    return this.#status;
  }

  get assignedAt(): Date {
    return this.#assignedAt;
  }

  asignarPaciente(): boolean {
    if (!this.#psychologistId.trim() || !this.#childId.trim()) {
      return false;
    }

    this.#status = AssignmentStatus.ACTIVE;
    return true;
  }

  verificarAsignacion(): boolean {
    return this.#status === AssignmentStatus.ACTIVE;
  }

  consultarEstado(): AssignmentStatus {
    return this.#status;
  }
}
