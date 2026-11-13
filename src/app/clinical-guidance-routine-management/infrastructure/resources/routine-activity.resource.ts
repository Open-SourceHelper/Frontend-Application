/**
 * Resource representation of a routine activity.
 */
export interface RoutineActivityResource {
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
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Response envelope for routine activity collection queries.
 */
export interface RoutineActivitiesResponse {
  activities: RoutineActivityResource[];
}
