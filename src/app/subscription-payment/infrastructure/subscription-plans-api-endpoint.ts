import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {SubscriptionPlan} from '../domain/model/subscription-plan.entity';
import {SubscriptionPlanResource, SubscriptionPlansResponse} from './subscription-plans-response';
import {SubscriptionPlanAssembler} from './subscription-plan-assembler';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for subscription plan CRUD operations.
 */
export class SubscriptionPlansApiEndpoint extends BaseApiEndpoint<SubscriptionPlan, SubscriptionPlanResource, SubscriptionPlansResponse, SubscriptionPlanAssembler> {
  /**
   * Creates an instance of SubscriptionPlansApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderSubscriptionPlansEndpointPath}`, new SubscriptionPlanAssembler());
  }
}
