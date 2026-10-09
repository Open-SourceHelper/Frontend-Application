
import { CareNetworkInvitation } from '../../domain/model/care-network-invitation.entity';
import { CareNetworkInvitationResource } from '../resources/care-network-invitation.resource';

export class CareNetworkInvitationAssembler {

  static toEntityFromResource(
    resource: CareNetworkInvitationResource
  ): CareNetworkInvitation {
    return new CareNetworkInvitation(
      resource.id,
      resource.careNetworkId,
      resource.inviteeEmail,
      resource.status,
      new Date(resource.createdAt),
      new Date(resource.expiresAt),
      resource.acceptedAt
        ? new Date(resource.acceptedAt)
        : null
    );
  }

  static toEntitiesFromResponse(
    resources: CareNetworkInvitationResource[]
  ): CareNetworkInvitation[] {
    return resources.map(resource =>
      this.toEntityFromResource(resource)
    );
  }

  static toResourceFromEntity(
    entity: CareNetworkInvitation
  ): CareNetworkInvitationResource {
    return {
      id: entity.id,
      careNetworkId: entity.careNetworkId,
      inviteeEmail: entity.inviteeEmail,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      expiresAt: entity.expiresAt.toISOString(),
      acceptedAt: entity.acceptedAt?.toISOString() ?? null
    };
  }
}
