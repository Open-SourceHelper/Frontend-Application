/**
 * Domain event raised when a routine is created (US15).
 */
export class RoutineCreatedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly routineId: number,
    public readonly childId: string
  ) {}
}
