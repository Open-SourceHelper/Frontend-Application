/**
 * Domain event raised when a premium user requests the cancellation of the subscription (US39).
 */
export class SubscriptionCancellationRequestedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly subscriptionId: number,
    public readonly effectiveDate: Date
  ) {}
}
