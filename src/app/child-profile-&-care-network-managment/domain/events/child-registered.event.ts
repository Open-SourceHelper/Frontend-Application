export class ChildRegisteredEvent {
  constructor(
    readonly childId: string,
    readonly parentId: string,
    readonly occurredAt: Date = new Date(),
  ) {
  }
}
