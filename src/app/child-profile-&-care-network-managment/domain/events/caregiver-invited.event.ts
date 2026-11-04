export class CaregiverInvitedEvent {
  constructor(
    readonly childId: string,
    readonly email: string,
    readonly occurredAt: Date = new Date(),
  ) {
  }
}
