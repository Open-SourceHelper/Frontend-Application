
export class CareNetworkInvitationAcceptedEvent {
  constructor(
    readonly invitationId: string,
    readonly careNetworkId: string,
    readonly caregiverId: string,
    readonly occurredOn: Date = new Date()
  ) {}
}
