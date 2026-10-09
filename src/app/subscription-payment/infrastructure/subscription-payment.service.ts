import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {SubscriptionPlan} from '../domain/model/subscription-plan.entity';
import {Subscription} from '../domain/model/subscription.entity';
import {Payment} from '../domain/model/payment.entity';
import {CancellationRequest} from '../domain/model/cancellation-request.entity';
import {SubscriptionPlansApiEndpoint} from './subscription-plans-api-endpoint';
import {SubscriptionsApiEndpoint} from './subscriptions-api-endpoint';
import {PaymentsApiEndpoint} from './payments-api-endpoint';
import {CancellationRequestsApiEndpoint} from './cancellation-requests-api-endpoint';

/**
 * Infrastructure facade for plan, subscription, payment and cancellation request endpoint operations.
 */
@Service()
export class SubscriptionPaymentService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly plansEndpoint = new SubscriptionPlansApiEndpoint(this.http);
  private readonly subscriptionsEndpoint = new SubscriptionsApiEndpoint(this.http);
  private readonly paymentsEndpoint = new PaymentsApiEndpoint(this.http);
  private readonly cancellationRequestsEndpoint = new CancellationRequestsApiEndpoint(this.http);

  /** Retrieves all subscription plans. */
  getPlans = (): Observable<SubscriptionPlan[]> =>
    this.plansEndpoint.getAll();

  /** Retrieves all subscriptions. */
  getSubscriptions = (): Observable<Subscription[]> =>
    this.subscriptionsEndpoint.getAll();

  /** Creates a subscription. */
  createSubscription = (subscription: Subscription): Observable<Subscription> =>
    this.subscriptionsEndpoint.create(subscription);

  /** Updates a subscription. */
  updateSubscription = (subscription: Subscription): Observable<Subscription> =>
    this.subscriptionsEndpoint.update(subscription, subscription.id);

  /** Retrieves all payments. */
  getPayments = (): Observable<Payment[]> =>
    this.paymentsEndpoint.getAll();

  /** Creates a payment. */
  createPayment = (payment: Payment): Observable<Payment> =>
    this.paymentsEndpoint.create(payment);

  /** Updates a payment. */
  updatePayment = (payment: Payment): Observable<Payment> =>
    this.paymentsEndpoint.update(payment, payment.id);

  /** Retrieves all cancellation requests. */
  getCancellationRequests = (): Observable<CancellationRequest[]> =>
    this.cancellationRequestsEndpoint.getAll();

  /** Creates a cancellation request. */
  createCancellationRequest = (request: CancellationRequest): Observable<CancellationRequest> =>
    this.cancellationRequestsEndpoint.create(request);
}
