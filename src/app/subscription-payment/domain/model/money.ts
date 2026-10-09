/**
 * Value Object that represents an amount of money in a given currency.
 */
export class Money {
  /**
   * Amount of money.
   */
  readonly #amount: number;

  /**
   * ISO 4217 currency code.
   */
  readonly #currency: string;

  /**
   * Creates a new amount of money.
   * @param amount - Amount of money.
   * @param currency - ISO 4217 currency code (PEN by default).
   */
  constructor(amount: number, currency: string = 'PEN') {
    this.#amount = amount;
    this.#currency = currency;
  }

  /**
   * Gets the amount of money.
   */
  get amount(): number {
    return this.#amount;
  }

  /**
   * Gets the currency code.
   */
  get currency(): string {
    return this.#currency;
  }

  /**
   * Checks the business rule "precio válido": a positive amount with a currency.
   * @returns True when the amount is greater than zero.
   */
  esValido(): boolean {
    return Number.isFinite(this.#amount) && this.#amount > 0 && this.#currency.trim().length === 3;
  }

  /**
   * Formats the amount for display (e.g. "S/ 19.90").
   */
  toString(): string {
    const symbol = this.#currency === 'PEN' ? 'S/' : this.#currency;
    return `${symbol} ${this.#amount.toFixed(2)}`;
  }
}
