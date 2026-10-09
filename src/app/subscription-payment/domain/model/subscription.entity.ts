import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {SubscriptionStatus} from './subscription-status';
import {Payment} from './payment.entity';
import {CancellationRequest} from './cancellation-request.entity';

/**
 * Subscription aggregate root. Controls the lifecycle of a premium subscription and
 * its relationship with payments and cancellation requests.
 *
 * @remarks
 * userId is a reference by identifier to the User aggregate of
 * Identity & Access Management (BC01); the user entity is not duplicated here.
 */
export class Subscription implements BaseEntity {
  #id: number;
  #userId: string;
  #planId: number;
  #status: SubscriptionStatus;
  #startDate: Date | null;
  #endDate: Date | null;
  #createdAt: Date;
  #payments: Payment[];
  #cancellationRequest: CancellationRequest | null;

  /**
   * Creates a new subscription.
   * @param props - Initialization values.
   */
  constructor(props: {
    id: number;
    userId: string;
    planId: number;
    status?: SubscriptionStatus;
    startDate?: Date | null;
    endDate?: Date | null;
    createdAt?: Date;
    payments?: Payment[];
    cancellationRequest?: CancellationRequest | null;
  }) {
    this.#id = props.id;
    this.#userId = props.userId;
    this.#planId = props.planId;
    this.#status = props.status ?? SubscriptionStatus.PENDING_PAYMENT;
    this.#startDate = props.startDate ?? null;
    this.#endDate = props.endDate ?? null;
    this.#createdAt = props.createdAt ?? new Date();
    this.#payments = props.payments ?? [];
    this.#cancellationRequest = props.cancellationRequest ?? null;
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get userId(): string {
    return this.#userId;
  }

  get planId(): number {
    return this.#planId;
  }

  get status(): SubscriptionStatus {
    return this.#status;
  }

  get startDate(): Date | null {
    return this.#startDate;
  }

  get endDate(): Date | null {
    return this.#endDate;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get payments(): Payment[] {
    return this.#payments;
  }

  set payments(value: Payment[]) {
    this.#payments = value;
  }

  get cancellationRequest(): CancellationRequest | null {
    return this.#cancellationRequest;
  }

  set cancellationRequest(value: CancellationRequest | null) {
    this.#cancellationRequest = value;
  }

  /**
   * Indicates if the user currently has access to the premium features.
   * A scheduled cancellation keeps the service until the end of the cycle (US39).
   */
  get isPremium(): boolean {
    const inCycle = !!this.#endDate && this.#endDate.getTime() > Date.now();
    return inCycle && (this.#status === SubscriptionStatus.ACTIVE
      || this.#status === SubscriptionStatus.CANCELLATION_SCHEDULED);
  }

  /**
   * Indicates if the subscription is waiting for a confirmed payment.
   */
  get isPendingPayment(): boolean {
    return this.#status === SubscriptionStatus.PENDING_PAYMENT;
  }

  /**
   * Indicates if the subscription can be cancelled (US39: only active subscriptions).
   */
  get canBeCancelled(): boolean {
    return this.#status === SubscriptionStatus.ACTIVE;
  }

  /**
   * Returns the payments sorted from the most recent one.
   */
  consultarPagos(): Payment[] {
    return [...this.#payments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Activates the subscription for a billing cycle (US38).
   * The activation is conditioned to a confirmed payment.
   * @param payment - Payment processed by the gateway.
   * @param billingCycleMonths - Duration of the billing cycle of the selected plan.
   * @returns True when the subscription was activated.
   */
  activar(payment: Payment, billingCycleMonths: number): boolean {
    if (!this.isPendingPayment || !payment.isConfirmed || payment.subscriptionId !== this.#id) return false;
    const start = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + billingCycleMonths);
    this.#status = SubscriptionStatus.ACTIVE;
    this.#startDate = start;
    this.#endDate = end;
    return true;
  }

  /**
   * Requests the cancellation of the subscription (US39). The service remains available
   * until the end of the current billing cycle, so no future charges are made.
   * @param reason - Optional reason given by the user.
   * @returns The cancellation request, or null when the subscription cannot be cancelled.
   */
  solicitarCancelacion(reason: string = ''): CancellationRequest | null {
    if (!this.canBeCancelled || !this.#endDate) return null;
    this.#status = SubscriptionStatus.CANCELLATION_SCHEDULED;
    this.#cancellationRequest = new CancellationRequest({
      id: 0,
      subscriptionId: this.#id,
      reason,
      effectiveDate: this.#endDate
    });
    return this.#cancellationRequest;
  }

  /**
   * Closes the subscription when its billing cycle has ended.
   * A scheduled cancellation becomes CANCELLED; otherwise the subscription EXPIRES.
   * @returns True when the status changed.
   */
  finalizarCiclo(): boolean {
    if (!this.#endDate || this.#endDate.getTime() > Date.now()) return false;
    if (this.#status === SubscriptionStatus.CANCELLATION_SCHEDULED) {
      this.#status = SubscriptionStatus.CANCELLED;
      this.#cancellationRequest?.aplicar();
      return true;
    }
    if (this.#status === SubscriptionStatus.ACTIVE) {
      this.#status = SubscriptionStatus.EXPIRED;
      return true;
    }
    return false;
  }
}
