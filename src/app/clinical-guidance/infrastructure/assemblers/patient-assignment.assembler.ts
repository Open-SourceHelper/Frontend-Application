import { PatientAssignment } from '../../domain/model/patient-assignment.entity';
import { PatientAssignmentResource } from '../resources/patient-assignment.resource';

export class PatientAssignmentAssembler {

  static toEntityFromResource(
    resource: PatientAssignmentResource
  ): PatientAssignment {
    return new PatientAssignment(
      resource.id,
      resource.psychologistId,
      resource.childId,
      resource.status,
      new Date(resource.assignedAt)
    );
  }

  static toResourceFromEntity(
    entity: PatientAssignment
  ): PatientAssignmentResource {
    return {
      id: entity.id,
      psychologistId: entity.psychologistId,
      childId: entity.childId,
      status: entity.status,
      assignedAt: entity.assignedAt.toISOString()
    };
  }

  static toEntitiesFromResponse(
    resources: PatientAssignmentResource[]
  ): PatientAssignment[] {
    return resources.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
