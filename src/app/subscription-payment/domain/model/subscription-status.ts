/**
 * Lifecycle states of a subscription.
 *
 * @remarks
 * PENDING_PAYMENT: the plan was selected but no payment has been confirmed yet (US38).
 * CANCELLATION_SCHEDULED: the user cancelled, but the service remains available
 * until the current billing cycle ends (US39).
 */
export enum SubscriptionStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  CANCELLATION_SCHEDULED = 'CANCELLATION_SCHEDULED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}
