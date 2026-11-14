import { AssignmentStatus } from './assignment-status';

/** BC04 patient/professional association; IDs refer to BC01 and BC02. */
export class PatientAssignment {
  constructor(
    readonly id: string,
    readonly psychologistId: string,
    readonly childId: string,
    public status: AssignmentStatus = AssignmentStatus.INACTIVE,
    readonly assignedAt: Date = new Date(),
    public endedAt: Date | null = null
  ) {}

  asignarPaciente(): boolean {
    if (!this.psychologistId.trim() || !this.childId.trim()) return false;
    this.status = AssignmentStatus.ACTIVE;
    this.endedAt = null;
    return true;
  }

  verificarAsignacion(): boolean {
    return this.status === AssignmentStatus.ACTIVE && this.endedAt === null;
  }

  consultarEstado(): AssignmentStatus { return this.status; }
}
