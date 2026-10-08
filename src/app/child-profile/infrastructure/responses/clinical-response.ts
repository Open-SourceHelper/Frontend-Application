import {BaseResponse} from '../../../shared/infrastructure/base-response';

export interface ClinicalProfileResource {
  id: string;
  childId: string;
  specialNeeds: string;
  triggers: string;
  regulators: string;
  updatedAt: string;
}

export interface ClinicalProfileResponse extends BaseResponse {
  clinicalProfiles: ClinicalProfileResource[];
}
