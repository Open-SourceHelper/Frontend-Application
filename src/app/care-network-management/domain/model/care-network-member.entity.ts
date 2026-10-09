
import { MemberStatus } from './member-status';
import { CareRole } from './care-role';
import { PermissionSet } from './permission-set';

export class CareNetworkMember {
  constructor(
    readonly id: string,
    readonly careNetworkId: string,
    readonly caregiverId: string,
    readonly email: string,
    readonly role: CareRole = CareRole.CAREGIVER,
    public status: MemberStatus = MemberStatus.ACTIVE,
    readonly permissions: PermissionSet = PermissionSet.readonly(),
    readonly joinedAt: Date = new Date(),
    public revokedAt: Date | null = null
  ) {}

  revoke(): void {
    if (this.status !== MemberStatus.ACTIVE) {
      throw new Error('El miembro no está activo.');
    }

    this.status = MemberStatus.REVOKED;
    this.revokedAt = new Date();
  }

  canRead(): boolean {
    return this.status === MemberStatus.ACTIVE &&
      this.permissions.canReadChildProfile;
  }
}
