export class Email {
  public readonly value: string;

  constructor(value: string) {
    const normalizedEmail = value.trim().toLowerCase();

    if (!Email.isValid(normalizedEmail)) {
      throw new Error('El correo electrónico no es válido');
    }

    this.value = normalizedEmail;
  }

  static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validar(): boolean {
    return Email.isValid(this.value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
