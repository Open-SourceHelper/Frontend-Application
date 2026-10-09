import {CaregiverResource} from '../responses/caregiver-response';
import {CaregiverAuthorization} from '../../domain/model/caregiver-authorization.entity';
import {DateTime} from '../../../shared/domain/model/date-time';

export class CaregiverAssembler {
  static toEntityFromResource(
    resource: CaregiverResource
  ): CaregiverAuthorization {
    return new CaregiverAuthorization(
      resource.id,
      resource.childId,
      resource.caregiverId,
      resource.status,
      new DateTime(resource.authorizedAt),
      new DateTime(resource.revokedAt)
    );
  }

  static toResourceFromEntity(
    entity: CaregiverAuthorization
  ): CaregiverResource {
    return {
      id: entity.id,
      childId: entity.childId,
      caregiverId: entity.caregiverId,
      status: entity.status,
      authorizedAt: entity.authorizedAt.toString(),
      revokedAt: entity.revokedAt.toString()
    };
  }

  static toEntitiesFromResponse(
    response: CaregiverResource[]
  ): CaregiverAuthorization[] {
    return response.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
