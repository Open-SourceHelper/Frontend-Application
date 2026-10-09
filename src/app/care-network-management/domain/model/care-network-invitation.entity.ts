
import { InvitationStatus } from './invitation-status';

export class CareNetworkInvitation {
  constructor(
    readonly id: string,
    readonly careNetworkId: string,
    readonly inviteeEmail: string,
    public status: InvitationStatus = InvitationStatus.PENDING,
    readonly createdAt: Date = new Date(),
    readonly expiresAt: Date,
    public acceptedAt: Date | null = null
  ) {}

  isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  accept(): void {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('La invitación no está pendiente.');
    }

    if (this.isExpired()) {
      this.status = InvitationStatus.EXPIRED;
      throw new Error('La invitación ha expirado.');
    }

    this.status = InvitationStatus.ACCEPTED;
    this.acceptedAt = new Date();
  }

  reject(): void {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('La invitación no está pendiente.');
    }

    this.status = InvitationStatus.REJECTED;
  }

  expire(): void {
    if (
      this.status === InvitationStatus.PENDING &&
      this.isExpired()
    ) {
      this.status = InvitationStatus.EXPIRED;
    }
  }
}
