import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Payment} from '../domain/model/payment.entity';
import {PaymentStatus} from '../domain/model/payment-status';
import {PaymentMethod} from '../domain/model/payment-method';
import {PaymentResource, PaymentsResponse} from './payments-response';

/**
 * Maps payment entities to and from API resources.
 */
export class PaymentAssembler implements BaseAssembler<Payment, PaymentResource, PaymentsResponse> {

  /**
   * Converts a PaymentsResponse to an array of Payment entities.
   * @param response - The API response containing payments.
   * @returns An array of Payment entities.
   */
  toEntitiesFromResponse = (response: PaymentsResponse): Payment[] =>
    response.payments.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a PaymentResource to a Payment entity.
   * @param resource - The resource to convert.
   * @returns The converted Payment entity.
   */
  toEntityFromResource = (resource: PaymentResource): Payment =>
    new Payment({
      id: resource.id,
      subscriptionId: resource.subscriptionId,
      amount: resource.amount,
      currency: resource.currency,
      paymentMethod: resource.paymentMethod as PaymentMethod,
      status: resource.status as PaymentStatus,
      externalTransactionId: resource.externalTransactionId,
      createdAt: new Date(resource.createdAt),
      processedAt: resource.processedAt ? new Date(resource.processedAt) : null
    });

  /**
   * Converts a Payment entity to a PaymentResource.
   * @param entity - The entity to convert.
   * @returns The converted PaymentResource.
   */
  toResourceFromEntity = (entity: Payment): PaymentResource =>
    ({
      id: entity.id,
      subscriptionId: entity.subscriptionId,
      amount: entity.amount.amount,
      currency: entity.amount.currency,
      paymentMethod: entity.paymentMethod,
      status: entity.status,
      externalTransactionId: entity.externalTransactionId,
      createdAt: entity.createdAt.toISOString(),
      processedAt: entity.processedAt ? entity.processedAt.toISOString() : null
    } as PaymentResource);
}
