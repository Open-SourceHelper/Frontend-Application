import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {PlanType} from './plan-type';
import {PlanStatus} from './plan-status';
import {Money} from './money';

/**
 * Represents a plan of the subscription catalog (Familiar / Profesional) (US37).
 */
export class SubscriptionPlan implements BaseEntity {
  #id: number;
  #name: string;
  #planType: PlanType;
  #price: Money;
  #billingCycleMonths: number;
  #features: string[];
  #status: PlanStatus;

  /**
   * Creates a new subscription plan.
   * @param props - Initialization values.
   */
  constructor(props: {
    id: number;
    name: string;
    planType: PlanType;
    price: number;
    currency?: string;
    billingCycleMonths?: number;
    features?: string[];
    status?: PlanStatus;
  }) {
    this.#id = props.id;
    this.#name = props.name;
    this.#planType = props.planType;
    this.#price = new Money(props.price, props.currency ?? 'PEN');
    this.#billingCycleMonths = props.billingCycleMonths ?? 1;
    this.#features = props.features ?? [];
    this.#status = props.status ?? PlanStatus.AVAILABLE;
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get name(): string {
    return this.#name;
  }

  get planType(): PlanType {
    return this.#planType;
  }

  get price(): Money {
    return this.#price;
  }

  get billingCycleMonths(): number {
    return this.#billingCycleMonths;
  }

  get features(): string[] {
    return this.#features;
  }

  get status(): PlanStatus {
    return this.#status;
  }

  /**
   * Indicates if the plan can be selected by a user (US37).
   */
  get isAvailable(): boolean {
    return this.#status === PlanStatus.AVAILABLE;
  }

  /**
   * Validates the business rules of the plan.
   * @returns True when it has a name, a valid price and a positive billing cycle.
   */
  esValido(): boolean {
    return this.#name.trim().length > 0
      && this.#price.esValido()
      && Number.isInteger(this.#billingCycleMonths) && this.#billingCycleMonths > 0;
  }
}
