import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {SubscriptionPlan} from '../domain/model/subscription-plan.entity';
import {PlanType} from '../domain/model/plan-type';
import {PlanStatus} from '../domain/model/plan-status';
import {SubscriptionPlanResource, SubscriptionPlansResponse} from './subscription-plans-response';

/**
 * Maps subscription plan entities to and from API resources.
 */
export class SubscriptionPlanAssembler
  implements BaseAssembler<SubscriptionPlan, SubscriptionPlanResource, SubscriptionPlansResponse> {

  /**
   * Converts a SubscriptionPlansResponse to an array of SubscriptionPlan entities.
   * @param response - The API response containing plans.
   * @returns An array of SubscriptionPlan entities.
   */
  toEntitiesFromResponse = (response: SubscriptionPlansResponse): SubscriptionPlan[] =>
    response.subscriptionPlans.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a SubscriptionPlanResource to a SubscriptionPlan entity.
   * @param resource - The resource to convert.
   * @returns The converted SubscriptionPlan entity.
   */
  toEntityFromResource = (resource: SubscriptionPlanResource): SubscriptionPlan =>
    new SubscriptionPlan({
      id: resource.id,
      name: resource.name,
      planType: resource.planType as PlanType,
      price: resource.price,
      currency: resource.currency,
      billingCycleMonths: resource.billingCycleMonths,
      features: resource.features ?? [],
      status: resource.status as PlanStatus
    });

  /**
   * Converts a SubscriptionPlan entity to a SubscriptionPlanResource.
   * @param entity - The entity to convert.
   * @returns The converted SubscriptionPlanResource.
   */
  toResourceFromEntity = (entity: SubscriptionPlan): SubscriptionPlanResource =>
    ({
      id: entity.id,
      name: entity.name,
      planType: entity.planType,
      price: entity.price.amount,
      currency: entity.price.currency,
      billingCycleMonths: entity.billingCycleMonths,
      features: entity.features,
      status: entity.status
    } as SubscriptionPlanResource);
}
