/**
 * Value object representing a date and time.
 */
export class DateTime {
  private readonly date: Date;

  /**
   * Creates a new DateTime instance.
   *
   * @param value - ISO-8601 string or Date object.
   */
  constructor(value?: string | Date) {
    this.date = value ? new Date(value) : new Date();
  }

  /**
   * Returns the ISO-8601 string representation of the date and time.
   */
  toString(): string {
    return this.date.toISOString();
  }

  /**
   * Returns the locale-specific date string.
   */
  toLocaleDateString(): string {
    return this.date.toLocaleDateString();
  }

  /**
   * Returns the locale-specific time string.
   */
  toLocaleTimeString(): string {
    return this.date.toLocaleTimeString();
  }

  /**
   * Returns the Date object.
   */
  toDate(): Date {
    return this.date;
  }
}
