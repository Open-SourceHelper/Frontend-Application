
export class CareNetworkInvitationCreatedEvent {
  constructor(
    readonly invitationId: string,
    readonly careNetworkId: string,
    readonly inviteeEmail: string,
    readonly occurredOn: Date = new Date()
  ) {}
}
