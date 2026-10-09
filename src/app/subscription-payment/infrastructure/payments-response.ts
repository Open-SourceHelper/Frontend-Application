import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a payment.
 */
export interface PaymentResource extends BaseResource {
  id: number;
  subscriptionId: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  externalTransactionId: string | null;
  createdAt: string;
  processedAt: string | null;
}

/**
 * Response envelope for payment collection queries.
 */
export interface PaymentsResponse extends BaseResponse {
  payments: PaymentResource[];
}
