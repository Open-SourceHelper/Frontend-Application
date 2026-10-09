
export class CareNetworkMemberRevokedEvent {
  constructor(
    readonly memberId: string,
    readonly careNetworkId: string,
    readonly occurredOn: Date = new Date()
  ) {}
}
