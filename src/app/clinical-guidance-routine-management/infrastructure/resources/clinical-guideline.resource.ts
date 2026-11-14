import { GuidelineStatus } from '../../domain/model/guideline-status';
/** Existing json-server data may omit the newly introduced BC04 attributes. */
export interface ClinicalGuidelineResource {
  id: string;
  psychologistId: string;
  childId: string;
  patientAssignmentId?: string;
  title?: string;
  instructions: string;
  status: GuidelineStatus;
  createdAt: string;
  updatedAt: string;
}
