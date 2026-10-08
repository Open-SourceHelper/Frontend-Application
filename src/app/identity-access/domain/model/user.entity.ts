import { UserRole } from './user-role.enum';
import { Email } from './email.vo';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    private passwordHash: string,
    public role: UserRole,
    public isValidated: boolean,
    public readonly createdAt: string
  ) {}

  registrar(): boolean {
    return new Email(this.email).validar();
  }

  autenticar(password: string): boolean {
    return this.passwordHash === password;
  }

  asignarRol(role: UserRole): void {
    this.role = role;
  }

  cambiarContrasena(newPassword: string): void {
    this.passwordHash = newPassword;
  }

  validarCuenta(): void {
    this.isValidated = true;
  }
}
