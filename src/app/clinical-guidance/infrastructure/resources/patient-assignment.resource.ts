import { AssignmentStatus } from '../../domain/model/assignment-status';

export interface PatientAssignmentResource {
  id: string;
  psychologistId: string;
  childId: string;
  status: AssignmentStatus;
  assignedAt: string;
}
