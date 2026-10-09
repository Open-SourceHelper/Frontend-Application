import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a routine.
 */
export interface RoutineResource extends BaseResource {
  id: number;
  childId: string;
  originalRoutineId: number | null;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

/**
 * Response envelope for routine collection queries.
 */
export interface RoutinesResponse extends BaseResponse {
  routines: RoutineResource[];
}
