import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {CancellationRequest} from '../domain/model/cancellation-request.entity';
import {CancellationStatus} from '../domain/model/cancellation-status';
import {CancellationRequestResource, CancellationRequestsResponse} from './cancellation-requests-response';

/**
 * Maps cancellation request entities to and from API resources.
 */
export class CancellationRequestAssembler
  implements BaseAssembler<CancellationRequest, CancellationRequestResource, CancellationRequestsResponse> {

  /**
   * Converts a CancellationRequestsResponse to an array of CancellationRequest entities.
   * @param response - The API response containing cancellation requests.
   * @returns An array of CancellationRequest entities.
   */
  toEntitiesFromResponse = (response: CancellationRequestsResponse): CancellationRequest[] =>
    response.cancellationRequests.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a CancellationRequestResource to a CancellationRequest entity.
   * @param resource - The resource to convert.
   * @returns The converted CancellationRequest entity.
   */
  toEntityFromResource = (resource: CancellationRequestResource): CancellationRequest =>
    new CancellationRequest({
      id: resource.id,
      subscriptionId: resource.subscriptionId,
      reason: resource.reason,
      requestedAt: new Date(resource.requestedAt),
      effectiveDate: new Date(resource.effectiveDate),
      status: resource.status as CancellationStatus
    });

  /**
   * Converts a CancellationRequest entity to a CancellationRequestResource.
   * @param entity - The entity to convert.
   * @returns The converted CancellationRequestResource.
   */
  toResourceFromEntity = (entity: CancellationRequest): CancellationRequestResource =>
    ({
      id: entity.id,
      subscriptionId: entity.subscriptionId,
      reason: entity.reason,
      requestedAt: entity.requestedAt.toISOString(),
      effectiveDate: entity.effectiveDate.toISOString(),
      status: entity.status
    } as CancellationRequestResource);
}
