import {ClinicalProfileResource} from '../responses/clinical-response';
import {ClinicalProfile} from '../../domain/model/clinical-profile.entity';
import {DateTime} from '../../../shared/domain/model/date-time';
import {ChildResource} from '../responses/child-response';
import {Child} from '../../domain/model/child.entity';

export class ClinicalAssembler {
  static toEntityFromResource(
    resource: ClinicalProfileResource
  ): ClinicalProfile {
    return new ClinicalProfile(
      resource.id,
      resource.childId,
      resource.specialNeeds,
      resource.triggers,
      resource.regulators,
      new DateTime(resource.updatedAt)
    );
  }

  static toResourceFromEntity(
    entity: ClinicalProfile
  ): ClinicalProfileResource {
    return {
      id: entity.id,
      childId: entity.childId,
      specialNeeds: entity.specialNeeds,
      triggers: entity.triggers,
      regulators: entity.regulators,
      updatedAt: entity.updatedAt.toString()
    };
  }

  static toEntitiesFromResponse(
    response: ClinicalProfileResource[]
  ): ClinicalProfile[] {
    return response.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
