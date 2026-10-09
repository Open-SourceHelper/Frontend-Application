import {Service} from '@angular/core';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Payment} from '../domain/model/payment.entity';

/**
 * Result returned by a payment gateway after processing a charge.
 */
export interface PaymentGatewayResult {
  approved: boolean;
  externalTransactionId: string | null;
}

/**
 * Payment Gateway Client of the BC08 component diagram.
 *
 * @remarks
 * Simulates Culqi (local cards) and PayPal (international payments) until the Spring Boot
 * RESTful API integrates the real services. Card data is never captured nor stored by Kinemo:
 * the real integration uses Culqi Checkout / PayPal Buttons, which tokenize the card.
 */
@Service()
export class PaymentGatewayClient {

  /**
   * Sends a charge request to the selected gateway.
   * @param payment - Pending payment to process.
   * @param approve - Simulated gateway answer (lets the demo show the rejection branch).
   * @returns Stream with the gateway result.
   */
  charge = (payment: Payment, approve: boolean): Observable<PaymentGatewayResult> =>
    of({
      approved: approve,
      externalTransactionId: approve
        ? `${payment.paymentMethod.toLowerCase()}_${Date.now().toString(36)}`
        : null
    }).pipe(delay(800));
}
