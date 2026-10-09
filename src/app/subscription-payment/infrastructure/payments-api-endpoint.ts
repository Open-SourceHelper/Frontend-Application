import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Payment} from '../domain/model/payment.entity';
import {PaymentResource, PaymentsResponse} from './payments-response';
import {PaymentAssembler} from './payment-assembler';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for payment CRUD operations.
 */
export class PaymentsApiEndpoint extends BaseApiEndpoint<Payment, PaymentResource, PaymentsResponse, PaymentAssembler> {
  /**
   * Creates an instance of PaymentsApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderPaymentsEndpointPath}`, new PaymentAssembler());
  }
}
