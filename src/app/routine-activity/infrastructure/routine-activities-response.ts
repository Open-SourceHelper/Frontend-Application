import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a routine activity.
 */
export interface RoutineActivityResource extends BaseResource {
  id: number;
  routineId: number;
  name: string;
  description: string;
  activityOrder: number;
  durationMinutes: number;
  status: string;
  transitionDurationMinutes: number;
  alertType: string;
  completedAt: string | null;
}

/**
 * Response envelope for routine activity collection queries.
 */
export interface RoutineActivitiesResponse extends BaseResponse {
  activities: RoutineActivityResource[];
}
