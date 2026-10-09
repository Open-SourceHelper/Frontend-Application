/**
 * Domain event raised when the payment gateway confirms a payment (US38).
 */
export class PaymentConfirmedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly paymentId: number,
    public readonly subscriptionId: number,
    public readonly externalTransactionId: string
  ) {}
}
