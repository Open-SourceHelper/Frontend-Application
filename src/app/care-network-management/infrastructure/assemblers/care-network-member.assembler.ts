
import { CareNetworkMember } from '../../domain/model/care-network-member.entity';
import { PermissionSet } from '../../domain/model/permission-set';
import { CareNetworkMemberResource } from '../resources/care-network-member.resource';

export class CareNetworkMemberAssembler {

  static toEntityFromResource(
    resource: CareNetworkMemberResource
  ): CareNetworkMember {
    return new CareNetworkMember(
      resource.id,
      resource.careNetworkId,
      resource.caregiverId,
      resource.email,
      resource.role,
      resource.status,
      new PermissionSet(
        resource.permissions.canReadChildProfile,
        resource.permissions.canEditChildProfile
      ),
      new Date(resource.joinedAt),
      resource.revokedAt
        ? new Date(resource.revokedAt)
        : null
    );
  }

  static toEntitiesFromResponse(
    resources: CareNetworkMemberResource[]
  ): CareNetworkMember[] {
    return resources.map(resource =>
      this.toEntityFromResource(resource)
    );
  }

  static toResourceFromEntity(
    entity: CareNetworkMember
  ): CareNetworkMemberResource {
    return {
      id: entity.id,
      careNetworkId: entity.careNetworkId,
      caregiverId: entity.caregiverId,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      permissions: {
        canReadChildProfile:
        entity.permissions.canReadChildProfile,
        canEditChildProfile:
        entity.permissions.canEditChildProfile
      },
      joinedAt: entity.joinedAt.toISOString(),
      revokedAt: entity.revokedAt?.toISOString() ?? null
    };
  }
}
