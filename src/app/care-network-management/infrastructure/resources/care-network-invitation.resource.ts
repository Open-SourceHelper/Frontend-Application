
import { InvitationStatus } from '../../domain/model/invitation-status';

export interface CareNetworkInvitationResource {
  id: string;
  careNetworkId: string;
  inviteeEmail: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}
