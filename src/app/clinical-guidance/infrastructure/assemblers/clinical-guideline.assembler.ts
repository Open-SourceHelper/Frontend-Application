import { ClinicalGuideline } from '../../domain/model/clinical-guideline.entity';
import { ClinicalGuidelineResource } from '../resources/clinical-guideline.resource';

/**
 * Converts API resources into domain entities and vice versa.
 */
export class ClinicalGuidelineAssembler {

  static toEntityFromResource(
    resource: ClinicalGuidelineResource
  ): ClinicalGuideline {
    return new ClinicalGuideline(
      resource.id,
      resource.psychologistId,
      resource.childId,
      resource.instructions,
      resource.status,
      new Date(resource.createdAt),
      new Date(resource.updatedAt)
    );
  }

  static toResourceFromEntity(
    entity: ClinicalGuideline
  ): ClinicalGuidelineResource {
    return {
      id: entity.id,
      psychologistId: entity.psychologistId,
      childId: entity.childId,
      instructions: entity.instructions,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  static toEntitiesFromResponse(
    response: ClinicalGuidelineResource[]
  ): ClinicalGuideline[] {
    return response.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
