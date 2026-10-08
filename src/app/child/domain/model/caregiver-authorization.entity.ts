import {DateTime} from '../../../shared/domain/model/date-time';
import {Child} from './child.entity';

export class CaregiverAuthorization {
  #id: string;
  #childId: string;
  #caregiverId: string;
  #status: string;
  #authorizedAt: DateTime;
  #revokedAt: DateTime;
  #child: Child | null;

  constructor(id: string, childId: string, caregiverId: string, status: string,
              authorizedAt: DateTime, revokedAt: DateTime, child?: Child | null) {
    this.#id = id;
    this.#childId = childId;
    this.#caregiverId = caregiverId;
    this.#status = status;
    this.#authorizedAt = authorizedAt;
    this.#revokedAt = revokedAt;
    this.#child = child ?? null;
  }


  get id(): string {
    return this.#id;
  }
  get childId(): string {
    return this.#childId;
  }
  get caregiverId(): string {
    return this.#caregiverId;
  }
  get status(): string {
    return this.#status;
  }
  get authorizedAt(): DateTime {
    return this.#authorizedAt;
  }
  get revokedAt(): DateTime {
    return this.#revokedAt;
  }
  get child(): Child | null {
    return this.#child;
  }
}
