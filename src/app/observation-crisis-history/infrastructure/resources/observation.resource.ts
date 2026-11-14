import { CrisisSeverity } from '../../domain/model/crisis-severity.enum';

export interface ObservationResource {
  id: string;
  childId: string;
  caregiverId: string;
  description: string;
  occurredAt: string;
  crisisSeverity: CrisisSeverity | null;
}

export interface PsychologistCommentResource {
  id: string;
  observationId: string;
  psychologistId: string;
  content: string;
  createdAt: string;
}

export interface ObservationEvidenceResource {
  id: string;
  observationId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}
