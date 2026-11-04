export class ClinicalProfileUpdatedEvent {
  constructor(
    readonly childId: string,
    readonly occurredAt: Date = new Date(),
  ) {
  }
}
