import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a subscription plan.
 */
export interface SubscriptionPlanResource extends BaseResource {
  id: number;
  name: string;
  planType: string;
  price: number;
  currency: string;
  billingCycleMonths: number;
  features: string[];
  status: string;
}

/**
 * Response envelope for subscription plan collection queries.
 */
export interface SubscriptionPlansResponse extends BaseResponse {
  subscriptionPlans: SubscriptionPlanResource[];
}
