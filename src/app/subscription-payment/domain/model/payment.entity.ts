import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {PaymentStatus} from './payment-status';
import {PaymentMethod} from './payment-method';
import {Money} from './money';

/**
 * Represents a payment attempt of a subscription processed by a third-party service (US38).
 */
export class Payment implements BaseEntity {
  #id: number;
  #subscriptionId: number;
  #amount: Money;
  #paymentMethod: PaymentMethod;
  #status: PaymentStatus;
  #externalTransactionId: string | null;
  #createdAt: Date;
  #processedAt: Date | null;

  /**
   * Creates a new payment.
   * @param props - Initialization values.
   */
  constructor(props: {
    id: number;
    subscriptionId: number;
    amount: number;
    currency?: string;
    paymentMethod: PaymentMethod;
    status?: PaymentStatus;
    externalTransactionId?: string | null;
    createdAt?: Date;
    processedAt?: Date | null;
  }) {
    this.#id = props.id;
    this.#subscriptionId = props.subscriptionId;
    this.#amount = new Money(props.amount, props.currency ?? 'PEN');
    this.#paymentMethod = props.paymentMethod;
    this.#status = props.status ?? PaymentStatus.PENDING;
    this.#externalTransactionId = props.externalTransactionId ?? null;
    this.#createdAt = props.createdAt ?? new Date();
    this.#processedAt = props.processedAt ?? null;
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get subscriptionId(): number {
    return this.#subscriptionId;
  }

  set subscriptionId(value: number) {
    this.#subscriptionId = value;
  }

  get amount(): Money {
    return this.#amount;
  }

  get paymentMethod(): PaymentMethod {
    return this.#paymentMethod;
  }

  get status(): PaymentStatus {
    return this.#status;
  }

  get externalTransactionId(): string | null {
    return this.#externalTransactionId;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get processedAt(): Date | null {
    return this.#processedAt;
  }

  /**
   * Indicates if the payment was confirmed by the gateway.
   */
  get isConfirmed(): boolean {
    return this.#status === PaymentStatus.CONFIRMED;
  }

  /**
   * Registers the confirmation returned by the payment gateway (US38).
   * @param externalTransactionId - Transaction identifier returned by Culqi / PayPal.
   */
  confirmarPago(externalTransactionId: string): void {
    if (this.#status !== PaymentStatus.PENDING) return;
    this.#status = PaymentStatus.CONFIRMED;
    this.#externalTransactionId = externalTransactionId;
    this.#processedAt = new Date();
  }

  /**
   * Registers the rejection returned by the payment gateway (US38, rejection branch).
   */
  rechazarPago(): void {
    if (this.#status !== PaymentStatus.PENDING) return;
    this.#status = PaymentStatus.REJECTED;
    this.#processedAt = new Date();
  }
}
