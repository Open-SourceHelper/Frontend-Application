import { UserRole } from './user-role.enum';
import { Email } from './email.vo';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public role: UserRole,
    public isValidated: boolean,
    public readonly createdAt: string
  ) {
    this.email = new Email(email).value;
  }

  registrar(): boolean {
    return new Email(this.email).validar();
  }

  validarCuenta(): void {
    this.isValidated = true;
  }

  actualizarCorreo(newEmail: string): void {
    this.email = new Email(newEmail).value;
    this.isValidated = false;
  }

  tieneRol(role: UserRole): boolean {
    return this.role === role;
  }

  estaValidado(): boolean {
    return this.isValidated;
  }
}
