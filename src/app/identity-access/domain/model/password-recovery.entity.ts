import { RecoveryStatus } from './recovery-status.enum';

export class PasswordRecovery {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public recoveryToken: string,
    public status: RecoveryStatus,
    public expiresAt: string,
    public readonly createdAt: string
  ) {}

  generarToken(): string {
    return this.recoveryToken;
  }

  validarToken(): boolean {
    return (
      this.status === RecoveryStatus.PENDING &&
      new Date(this.expiresAt).getTime() > Date.now()
    );
  }

  restablecerContrasena(): boolean {
    if (!this.validarToken()) {
      return false;
    }

    this.status = RecoveryStatus.USED;
    return true;
  }

  expirar(): void {
    this.status = RecoveryStatus.EXPIRED;
  }
}
