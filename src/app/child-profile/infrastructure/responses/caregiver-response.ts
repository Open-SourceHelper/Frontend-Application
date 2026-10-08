import {BaseResponse} from '../../../shared/infrastructure/base-response';

export interface CaregiverResource {
  id: string;
  childId: string;
  caregiverId: string;
  status: string;
  authorizedAt: string;
  revokedAt: string;
}

export interface CaregiverResponse extends BaseResponse {
  caregivers: CaregiverResource[];
}
