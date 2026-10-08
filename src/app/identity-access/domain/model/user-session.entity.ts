import { SessionStatus } from './session-status.enum';

export class UserSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public sessionToken: string,
    public status: SessionStatus,
    public readonly createdAt: string,
    public closedAt: string | null
  ) {}

  iniciarSesion(): void {
    this.status = SessionStatus.ACTIVE;
    this.closedAt = null;
  }

  cerrarSesion(): void {
    this.status = SessionStatus.CLOSED;
    this.closedAt = new Date().toISOString();
  }

  validarSesion(): boolean {
    return this.status === SessionStatus.ACTIVE;
  }
}
