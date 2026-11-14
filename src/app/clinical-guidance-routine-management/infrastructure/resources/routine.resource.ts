/**
 * Resource representation of a routine.
 */
export interface RoutineResource {
  id: number;
  childId: string;
  originalRoutineId: number | null;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Response envelope for routine collection queries.
 */
export interface RoutinesResponse {
  routines: RoutineResource[];
}
