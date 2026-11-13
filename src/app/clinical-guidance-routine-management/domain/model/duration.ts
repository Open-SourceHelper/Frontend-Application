/**
 * Value Object that represents a duration expressed in minutes.
 */
export class Duration {
  /**
   * Amount of minutes.
   */
  readonly #minutes: number;

  /**
   * Creates a new duration.
   * @param minutes - Amount of minutes.
   */
  constructor(minutes: number) {
    this.#minutes = minutes;
  }

  /**
   * Gets the amount of minutes.
   */
  get minutes(): number {
    return this.#minutes;
  }

  /**
   * Checks the business rule "estimación de tiempo válida" (US15, US16).
   * @returns True when the duration is a positive integer.
   */
  esValida(): boolean {
    return Number.isInteger(this.#minutes) && this.#minutes > 0;
  }
}
