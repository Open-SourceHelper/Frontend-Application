import { ActivityStatus } from '../../domain/model/activity-status';
import { AlertType } from '../../domain/model/alert-type';

/**
 * Resource representation of a routine activity received from the API.
 */
export interface RoutineActivityResource {
  id: number;
  routineId: number;
  title: string;
  order: number;
  durationMinutes: number;
  status: ActivityStatus;
  timerEnabled: boolean;
  alertType: AlertType;
  visualSupportId?: number;
}
