/**
 * Domain event raised when an activity is completed (US14).
 *
 * @remarks
 * Observation & Crisis Management (BC06) and Dashboard & Reporting (BC07)
 * are the consumers of this event once the backend is integrated.
 */
export class ActivityCompletedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly activityId: number
  ) {}
}
