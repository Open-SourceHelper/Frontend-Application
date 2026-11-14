
import {MemberStatus} from './member-status';
import {CareRole} from './care-role';
import {PermissionSet} from './permission-set';
import {email} from '@angular/forms/signals';

export class CareNetworkMember {
  #id: string;
  #careNetworkId: string;
  #caregiverId: string;
  #email: string;
  #role: CareRole;
  #status: MemberStatus;
  #permissions: PermissionSet;
  #joinedAt: Date;
  #revokedAt: Date | null;

  constructor(id: string, careNetworkId: string, caregiverId: string, email: string,
              role: CareRole = CareRole.CAREGIVER, status: MemberStatus = MemberStatus.ACTIVE,
              permissions: PermissionSet = PermissionSet.readonly(), joinedAt: Date = new Date(),
              revokedAt: Date | null = null
  ) {
    this.#id = id;
    this.#careNetworkId = careNetworkId;
    this.#caregiverId = caregiverId;
    this.#email = email;
    this.#role = role;
    this.#status = status;
    this.#permissions = permissions;
    this.#joinedAt = joinedAt;
    this.#revokedAt = revokedAt;
  }

  get id(): string {
    return this.#id;
  }
  get careNetworkId(): string {
    return this.#careNetworkId;
  }
  get caregiverId(): string {
    return this.#caregiverId;
  }
  get email(): string {
    return this.#email;
  }
  get role(): CareRole {
    return this.#role;
  }
  get status(): MemberStatus {
    return this.#status;
  }
  get permissions(): PermissionSet {
    return this.#permissions;
  }
  get joinedAt(): Date {
    return this.#joinedAt;
  }
  get revokedAt(): Date | null {
    return this.#revokedAt;
  }

  revoke(): void {
    if (this.#status !== MemberStatus.ACTIVE) {
      throw new Error('El miembro no está activo.');
    }

    this.#status = MemberStatus.REVOKED;
    this.#revokedAt = new Date();
  }

  canRead(): boolean {
    return this.#status === MemberStatus.ACTIVE &&
      this.#permissions.canReadChildProfile;
  }
}
