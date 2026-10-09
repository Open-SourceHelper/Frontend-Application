import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a cancellation request.
 */
export interface CancellationRequestResource extends BaseResource {
  id: number;
  subscriptionId: number;
  reason: string;
  requestedAt: string;
  effectiveDate: string;
  status: string;
}

/**
 * Response envelope for cancellation request collection queries.
 */
export interface CancellationRequestsResponse extends BaseResponse {
  cancellationRequests: CancellationRequestResource[];
}
