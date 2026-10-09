import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Subscription} from '../domain/model/subscription.entity';
import {SubscriptionStatus} from '../domain/model/subscription-status';
import {SubscriptionResource, SubscriptionsResponse} from './subscriptions-response';

/**
 * Maps subscription entities to and from API resources.
 */
export class SubscriptionAssembler
  implements BaseAssembler<Subscription, SubscriptionResource, SubscriptionsResponse> {

  /**
   * Converts a SubscriptionsResponse to an array of Subscription entities.
   * @param response - The API response containing subscriptions.
   * @returns An array of Subscription entities.
   */
  toEntitiesFromResponse = (response: SubscriptionsResponse): Subscription[] =>
    response.subscriptions.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a SubscriptionResource to a Subscription entity.
   * @param resource - The resource to convert.
   * @returns The converted Subscription entity.
   */
  toEntityFromResource = (resource: SubscriptionResource): Subscription =>
    new Subscription({
      id: resource.id,
      userId: resource.userId,
      planId: resource.planId,
      status: resource.status as SubscriptionStatus,
      startDate: resource.startDate ? new Date(resource.startDate) : null,
      endDate: resource.endDate ? new Date(resource.endDate) : null,
      createdAt: new Date(resource.createdAt)
    });

  /**
   * Converts a Subscription entity to a SubscriptionResource.
   * @param entity - The entity to convert.
   * @returns The converted SubscriptionResource.
   */
  toResourceFromEntity = (entity: Subscription): SubscriptionResource =>
    ({
      id: entity.id,
      userId: entity.userId,
      planId: entity.planId,
      status: entity.status,
      startDate: entity.startDate ? entity.startDate.toISOString() : null,
      endDate: entity.endDate ? entity.endDate.toISOString() : null,
      createdAt: entity.createdAt.toISOString()
    } as SubscriptionResource);
}
