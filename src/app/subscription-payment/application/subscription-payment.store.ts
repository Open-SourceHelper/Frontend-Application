import {computed, inject, Service, Signal, signal} from '@angular/core';
import {forkJoin, Observable, of, retry, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {SubscriptionPlan} from '../domain/model/subscription-plan.entity';
import {Subscription} from '../domain/model/subscription.entity';
import {Payment} from '../domain/model/payment.entity';
import {CancellationRequest} from '../domain/model/cancellation-request.entity';
import {PaymentMethod} from '../domain/model/payment-method';
import {SubscriptionPaymentService} from '../infrastructure/subscription-payment.service';
import {PaymentGatewayClient} from '../infrastructure/payment-gateway.client';

/**
 * States of the checkout flow shown by the payment view (US38).
 */
export type CheckoutStatus = 'IDLE' | 'PROCESSING' | 'CONFIRMED' | 'REJECTED';

/**
 * Retries a request a few times with a short delay.
 *
 * @remarks
 * json-server --watch restarts after every write, so chained requests can briefly fail.
 */
const persist = <T>(request: Observable<T>): Observable<T> =>
  request.pipe(retry({count: 3, delay: 500}));

/**
 * Holds Subscription & Payment Management application state and coordinates its use cases.
 */
@Service()
export class SubscriptionPaymentStore {
  private readonly subscriptionPaymentService = inject(SubscriptionPaymentService);
  private readonly paymentGatewayClient = inject(PaymentGatewayClient);

  private readonly plansSignal = signal<SubscriptionPlan[]>([]);
  private readonly subscriptionsSignal = signal<Subscription[]>([]);
  private readonly paymentsSignal = signal<Payment[]>([]);
  private readonly cancellationRequestsSignal = signal<CancellationRequest[]>([]);
  private readonly checkoutStatusSignal = signal<CheckoutStatus>('IDLE');
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  /**
   * Identifier of the signed-in user.
   *
   * @remarks
   * Reference to Identity & Access Management (BC01). Fixed demo user until the
   * authentication session is integrated.
   */
  readonly currentUserId = signal<string>('user-001');

  /**
   * Readonly signal for the plan catalog (US37).
   */
  readonly plans = this.plansSignal.asReadonly();

  /**
   * Plans that can currently be selected.
   */
  readonly availablePlans = computed(() => this.plans().filter(plan => plan.isAvailable));

  /**
   * Subscriptions of the current user, most recent first, each one composed with
   * its payments and its cancellation request.
   */
  readonly subscriptions = computed(() => this.subscriptionsSignal()
    .filter(subscription => subscription.userId === this.currentUserId())
    .map(subscription => this.composeSubscription(subscription))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));

  /**
   * Subscription that currently gives premium access, if any.
   */
  readonly activeSubscription = computed(() => this.subscriptions().find(subscription => subscription.isPremium));

  /**
   * Subscription shown in "Mi suscripción": the premium one, otherwise the most recent.
   */
  readonly currentSubscription = computed(() => this.activeSubscription() ?? this.subscriptions()[0]);

  /**
   * Readonly signal for the state of the checkout flow.
   */
  readonly checkoutStatus = this.checkoutStatusSignal.asReadonly();

  /**
   * Readonly signal indicating if data is loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Creates an instance of SubscriptionPaymentStore and loads initial data.
   */
  constructor() {
    this.loadAll();
  }

  /**
   * Selects a plan by identifier.
   * @param id - Plan identifier.
   * @returns Reactive selection for the requested plan.
   */
  getPlanById = (id: number): Signal<SubscriptionPlan | undefined> =>
    computed(() => id ? this.plans().find(plan => plan.id === id) : undefined);

  /**
   * Selects a subscription of the current user by identifier.
   * @param id - Subscription identifier.
   * @returns Reactive selection for the requested subscription.
   */
  getSubscriptionById = (id: number): Signal<Subscription | undefined> =>
    computed(() => id ? this.subscriptions().find(subscription => subscription.id === id) : undefined);

  /**
   * Selects a plan and pays it through the chosen gateway (US38).
   *
   * @remarks
   * A pending subscription of the same plan is reused, so a rejected payment can be retried.
   * The subscription is activated only when the gateway confirms the payment.
   * @param planId - Selected plan.
   * @param paymentMethod - Gateway that processes the payment.
   * @param approve - Simulated gateway answer.
   */
  paySubscription = (planId: number, paymentMethod: PaymentMethod, approve: boolean): void => {
    const plan = this.getPlanById(planId)();
    if (!plan || !plan.isAvailable) {
      this.errorSignal.set('El plan seleccionado no está disponible.');
      return;
    }
    if (this.activeSubscription()) {
      this.errorSignal.set('Ya tienes una suscripción activa. Cancélala antes de cambiar de plan.');
      return;
    }
    const pending = this.subscriptions().find(s => s.isPendingPayment && s.planId === planId);
    const subscription$ = pending
      ? of(pending)
      : persist(this.subscriptionPaymentService.createSubscription(
        new Subscription({id: 0, userId: this.currentUserId(), planId})));

    this.checkoutStatusSignal.set('PROCESSING');
    this.errorSignal.set(null);
    subscription$.pipe(
      switchMap(subscription => persist(this.subscriptionPaymentService.createPayment(new Payment({
        id: 0,
        subscriptionId: subscription.id,
        amount: plan.price.amount,
        currency: plan.price.currency,
        paymentMethod
      }))).pipe(map(payment => ({subscription, payment})))),
      switchMap(({subscription, payment}) => this.paymentGatewayClient.charge(payment, approve).pipe(
        switchMap(result => {
          if (result.approved && result.externalTransactionId) payment.confirmarPago(result.externalTransactionId);
          else payment.rechazarPago();
          return persist(this.subscriptionPaymentService.updatePayment(payment));
        }),
        switchMap(processed => processed.isConfirmed && subscription.activar(processed, plan.billingCycleMonths)
          ? persist(this.subscriptionPaymentService.updateSubscription(subscription)).pipe(map(() => true))
          : of(false))
      ))
    ).subscribe({
      next: confirmed => {
        this.checkoutStatusSignal.set(confirmed ? 'CONFIRMED' : 'REJECTED');
        this.loadAll();
      },
      error: err => {
        // Part of the operation may have been persisted: reload and keep the error visible.
        this.checkoutStatusSignal.set('IDLE');
        this.loadAll();
        this.errorSignal.set(this.formatError(err, 'Failed to process payment'));
      }
    });
  };

  /**
   * Resets the checkout flow before a new payment.
   */
  resetCheckout = (): void => {
    this.checkoutStatusSignal.set('IDLE');
    this.errorSignal.set(null);
  };

  /**
   * Schedules the cancellation of a subscription at the end of its billing cycle (US39).
   * @param id - Subscription identifier.
   * @param reason - Optional reason given by the user.
   */
  cancelSubscription = (id: number, reason: string = ''): void => {
    const subscription = this.getSubscriptionById(id)();
    if (!subscription) return;
    const request = subscription.solicitarCancelacion(reason.trim());
    if (!request) {
      this.errorSignal.set('Solo se pueden cancelar suscripciones activas.');
      return;
    }
    this.run('Failed to cancel subscription',
      persist(this.subscriptionPaymentService.updateSubscription(subscription)).pipe(
        switchMap(() => persist(this.subscriptionPaymentService.createCancellationRequest(request)))
      ));
  };

  /**
   * Loads plans, subscriptions, payments and cancellation requests from the API.
   */
  loadAll = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    forkJoin([
      this.subscriptionPaymentService.getPlans(),
      this.subscriptionPaymentService.getSubscriptions(),
      this.subscriptionPaymentService.getPayments(),
      this.subscriptionPaymentService.getCancellationRequests()
    ]).pipe(retry({count: 3, delay: 500})).subscribe({
      next: ([plans, subscriptions, payments, cancellationRequests]) => {
        this.plansSignal.set(plans);
        this.subscriptionsSignal.set(subscriptions);
        this.paymentsSignal.set(payments);
        this.cancellationRequestsSignal.set(cancellationRequests);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load subscriptions'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Executes a compound operation and reloads the state when it finishes.
   */
  private run = (fallback: string, operation: Observable<unknown>): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    operation.pipe(map(() => undefined)).subscribe({
      next: () => this.loadAll(),
      error: err => {
        // Part of the operation may have been persisted: reload and keep the error visible.
        this.loadAll();
        this.errorSignal.set(this.formatError(err, fallback));
      }
    });
  };

  /**
   * Builds a fresh Subscription instance with its payments and cancellation request,
   * so signals always notify changes.
   */
  private composeSubscription = (subscription: Subscription): Subscription =>
    new Subscription({
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      createdAt: subscription.createdAt,
      payments: this.paymentsSignal().filter(payment => payment.subscriptionId === subscription.id),
      cancellationRequest: this.cancellationRequestsSignal()
        .filter(request => request.subscriptionId === subscription.id)
        .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())[0] ?? null
    });

  /**
   * Normalizes unknown errors into a display-friendly message.
   * @param error - Source error.
   * @param fallback - Default message when details are unavailable.
   * @returns Normalized message.
   */
  private formatError = (error: unknown, fallback: string): string => {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  };
}
