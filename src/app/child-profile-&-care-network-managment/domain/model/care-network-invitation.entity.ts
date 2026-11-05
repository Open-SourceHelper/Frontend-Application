
import {InvitationStatus} from './invitation-status';

export class CareNetworkInvitation {
  #id: string;
  #careNetworkId: string;
  #inviteeEmail: string;
  #status: InvitationStatus;
  #createdAt: Date;
  #expiresAt: Date;
  #acceptedAt: Date | null;

  constructor(id: string, careNetworkId: string, inviteeEmail: string,
              status: InvitationStatus = InvitationStatus.PENDING, createdAt: Date = new Date(),
              expiresAt: Date, acceptedAt: Date | null = null
  ) {
    this.#id = id;
    this.#careNetworkId = careNetworkId;
    this.#inviteeEmail = inviteeEmail;
    this.#status = status;
    this.#createdAt = createdAt;
    this.#expiresAt = expiresAt;
    this.#acceptedAt = acceptedAt;
  }


  get id(): string {
    return this.#id;
  }
  get careNetworkId(): string {
    return this.#careNetworkId;
  }
  get inviteeEmail(): string {
    return this.#inviteeEmail;
  }
  get status(): InvitationStatus {
    return this.#status;
  }
  get createdAt(): Date {
    return this.#createdAt;
  }
  get expiresAt(): Date {
    return this.#expiresAt;
  }
  get acceptedAt(): Date | null {
    return this.#acceptedAt;
  }

  isExpired(): boolean {
    return new Date() >= this.#expiresAt;
  }

  accept(): void {
    if (this.#status !== InvitationStatus.PENDING) {
      throw new Error('La invitación no está pendiente.');
    }

    if (this.isExpired()) {
      this.#status = InvitationStatus.EXPIRED;
      throw new Error('La invitación ha expirado.');
    }

    this.#status = InvitationStatus.ACCEPTED;
    this.#acceptedAt = new Date();
  }

  reject(): void {
    if (this.#status !== InvitationStatus.PENDING) {
      throw new Error('La invitación no está pendiente.');
    }

    this.#status = InvitationStatus.REJECTED;
  }

  expire(): void {
    if (
      this.#status === InvitationStatus.PENDING &&
      this.isExpired()
    ) {
      this.#status = InvitationStatus.EXPIRED;
    }
  }
}
