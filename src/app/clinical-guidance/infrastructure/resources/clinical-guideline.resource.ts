import { GuidelineStatus } from '../../domain/model/guideline-status';

/**
 * Resource representation of a clinical guideline.
 */
export interface ClinicalGuidelineResource {
  id: string;
  psychologistId: string;
  childId: string;
  instructions: string;
  status: GuidelineStatus;
  createdAt: string;
  updatedAt: string;
}
