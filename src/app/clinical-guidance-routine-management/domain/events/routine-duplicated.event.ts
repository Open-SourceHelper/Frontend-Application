/**
 * Domain event raised when a routine is duplicated (US28).
 */
export class RoutineDuplicatedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly originalRoutineId: number,
    public readonly newRoutineId: number
  ) {}
}
