import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a subscription.
 */
export interface SubscriptionResource extends BaseResource {
  id: number;
  userId: string;
  planId: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
}

/**
 * Response envelope for subscription collection queries.
 */
export interface SubscriptionsResponse extends BaseResponse {
  subscriptions: SubscriptionResource[];
}
