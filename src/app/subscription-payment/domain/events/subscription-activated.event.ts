/**
 * Domain event raised when a subscription is activated after a confirmed payment (US38).
 *
 * @remarks
 * Identity & Access Management (BC01) is the consumer of this event once the backend
 * is integrated, to enable the premium features of the user.
 */
export class SubscriptionActivatedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly subscriptionId: number,
    public readonly userId: string,
    public readonly planId: number
  ) {}
}
