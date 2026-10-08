import {DateTime} from '../../../shared/domain/model/date-time';
import {Child} from './child.entity';

export class ClinicalProfile {
  #id: string;
  #childId: string;
  #specialNeeds: string;
  #triggers: string;
  #regulators: string;
  #updatedAt: DateTime;
  #child: Child | null;

  constructor(id: string, childId: string, specialNeeds: string, triggers: string,
              regulators: string, updatedAt: DateTime, child?: Child | null) {
    this.#id = id;
    this.#childId = childId;
    this.#specialNeeds = specialNeeds;
    this.#triggers = triggers;
    this.#regulators = regulators;
    this.#updatedAt = updatedAt;
    this.#child = child ?? null;
  }


  get id(): string {
    return this.#id;
  }
  get childId(): string {
    return this.#childId;
  }
  get specialNeeds(): string {
    return this.#specialNeeds;
  }
  get triggers(): string {
    return this.#triggers;
  }
  get regulators(): string {
    return this.#regulators;
  }
  get updatedAt(): DateTime {
    return this.#updatedAt;
  }
  get child(): Child | null {
    return this.#child;
  }
}
