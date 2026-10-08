/**
 * Event emitted when an activity is completed.
 */
export class ActivityCompletedEvent {
  constructor(
    public readonly activityId: number,
    public readonly routineId: number
  ) {}
}
