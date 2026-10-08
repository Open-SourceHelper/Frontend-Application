/**
 * Event emitted when a routine is duplicated.
 */
export class RoutineDuplicatedEvent {
  constructor(
    public readonly originalRoutineId: number,
    public readonly duplicatedRoutineId: number
  ) {}
}
