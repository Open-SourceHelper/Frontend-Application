/**
 * Event emitted when a routine is created.
 */
export class RoutineCreatedEvent {
  constructor(
    public readonly routineId: number,
    public readonly childId: number
  ) {}
}
