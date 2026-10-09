/**
 * Result of a payment attempt processed by the payment gateway (US38).
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}
