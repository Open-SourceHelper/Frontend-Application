import {DateTime} from '../../../shared/domain/model/date-time';
import {BaseResponse} from '../../../shared/infrastructure/base-response';

export interface CaregiverResource {
  id: string;
  childId: string;
  caregiverId: string;
  status: string;
  authorizedAt: DateTime;
  revokedAt: DateTime;
}

export interface CaregiverResponse extends BaseResponse {
  caregivers: CaregiverResource[];
}
