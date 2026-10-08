export class Email {
  constructor(public readonly value: string) {
    if (!this.validar()) {
      throw new Error('El correo electrónico no es válido');
    }
  }

  validar(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
  }
}
