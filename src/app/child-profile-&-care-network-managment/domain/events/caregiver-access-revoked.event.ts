export class CaregiverAccessRevokedEvent{
  constructor(
    readonly childId: string,
    readonly caregiverId: string,
    readonly occurredAt: Date = new Date(),
  ) {
  }
}
