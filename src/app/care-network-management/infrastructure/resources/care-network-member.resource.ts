
import { CareRole } from '../../domain/model/care-role';
import { MemberStatus } from '../../domain/model/member-status';

export interface CareNetworkMemberResource {
  id: string;
  careNetworkId: string;
  caregiverId: string;
  email: string;
  role: CareRole;
  status: MemberStatus;
  permissions: {
    canReadChildProfile: boolean;
    canEditChildProfile: boolean;
  };
  joinedAt: string;
  revokedAt: string | null;
}
