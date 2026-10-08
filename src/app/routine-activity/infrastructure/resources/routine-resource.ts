import { RoutineStatus } from '../../domain/model/routine-status';

/**
 * Resource representation of a routine received from the API.
 */
export interface RoutineResource {
  id: number;
  childId: number;
  name: string;
  status: RoutineStatus;
  activityIds: number[];
}
