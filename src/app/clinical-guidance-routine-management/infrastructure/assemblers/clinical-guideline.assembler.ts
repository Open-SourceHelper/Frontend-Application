import { ClinicalGuideline } from '../../domain/model/clinical-guideline.entity';
import { ClinicalGuidelineResource } from '../resources/clinical-guideline.resource';

export class ClinicalGuidelineAssembler {
  static toEntityFromResource(resource: ClinicalGuidelineResource): ClinicalGuideline {
    return new ClinicalGuideline(
      resource.id, resource.psychologistId, resource.childId, resource.instructions,
      resource.status, new Date(resource.createdAt), new Date(resource.updatedAt),
      resource.title ?? 'Pauta clínica', resource.patientAssignmentId ?? ''
    );
  }

  static toResourceFromEntity(entity: ClinicalGuideline): ClinicalGuidelineResource {
    return {
      id: entity.id,
      psychologistId: entity.psychologistId,
      childId: entity.childId,
      patientAssignmentId: entity.patientAssignmentId,
      title: entity.title,
      instructions: entity.instructions,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  static toEntitiesFromResponse(resources: ClinicalGuidelineResource[]): ClinicalGuideline[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }
}
