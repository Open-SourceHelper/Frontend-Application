/**
 * Third-party payment services integrated by Kinemo.
 *
 * @remarks
 * CULQI processes local card payments and PAYPAL international payments
 * (see the BC08 container diagram).
 */
export enum PaymentMethod {
  CULQI = 'CULQI',
  PAYPAL = 'PAYPAL'
}
