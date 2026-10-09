import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {CancellationStatus} from './cancellation-status';

/**
 * Formal request of a premium user to cancel the subscription at the end of the
 * current billing cycle (US39).
 */
export class CancellationRequest implements BaseEntity {
  #id: number;
  #subscriptionId: number;
  #reason: string;
  #requestedAt: Date;
  #effectiveDate: Date;
  #status: CancellationStatus;

  /**
   * Creates a new cancellation request.
   * @param props - Initialization values.
   */
  constructor(props: {
    id: number;
    subscriptionId: number;
    reason?: string;
    requestedAt?: Date;
    effectiveDate: Date;
    status?: CancellationStatus;
  }) {
    this.#id = props.id;
    this.#subscriptionId = props.subscriptionId;
    this.#reason = props.reason ?? '';
    this.#requestedAt = props.requestedAt ?? new Date();
    this.#effectiveDate = props.effectiveDate;
    this.#status = props.status ?? CancellationStatus.SCHEDULED;
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

  get reason(): string {
    return this.#reason;
  }

  get requestedAt(): Date {
    return this.#requestedAt;
  }

  get effectiveDate(): Date {
    return this.#effectiveDate;
  }

  get status(): CancellationStatus {
    return this.#status;
  }

  /**
   * Marks the request as applied once the billing cycle has ended.
   */
  aplicar(): void {
    this.#status = CancellationStatus.APPLIED;
  }
}
