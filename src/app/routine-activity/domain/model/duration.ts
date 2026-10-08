/**
 * Value Object that represents the duration of a routine activity.
 */
export class Duration {
  #minutes: number;

  constructor(minutes: number) {
    this.#minutes = minutes;
  }

  get minutes(): number {
    return this.#minutes;
  }

  validar(): boolean {
    return Number.isInteger(this.#minutes) && this.#minutes >= 0;
  }

  toMinutes(): number {
    return this.#minutes;
  }
}
