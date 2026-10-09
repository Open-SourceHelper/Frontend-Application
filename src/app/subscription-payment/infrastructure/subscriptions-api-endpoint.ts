import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Subscription} from '../domain/model/subscription.entity';
import {SubscriptionResource, SubscriptionsResponse} from './subscriptions-response';
import {SubscriptionAssembler} from './subscription-assembler';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for subscription CRUD operations.
 */
export class SubscriptionsApiEndpoint extends BaseApiEndpoint<Subscription, SubscriptionResource, SubscriptionsResponse, SubscriptionAssembler> {
  /**
   * Creates an instance of SubscriptionsApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderSubscriptionsEndpointPath}`, new SubscriptionAssembler());
  }
}
