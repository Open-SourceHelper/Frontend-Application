import { Observation } from '../../domain/model/observation.entity';
import { PsychologistComment } from '../../domain/model/psychologist-comment.entity';
import { ObservationEvidence } from '../../domain/model/observation-evidence.entity';
import {
  ObservationResource,
  PsychologistCommentResource,
  ObservationEvidenceResource
} from '../resources/observation.resource';

export class ObservationAssembler {
  static toEntityFromResource(
    resource: ObservationResource
  ): Observation {
    return new Observation(resource);
  }

  static toResourceFromEntity(
    entity: Observation
  ): ObservationResource {
    return {
      id: entity.id,
      childId: entity.childId,
      caregiverId: entity.caregiverId,
      description: entity.description,
      occurredAt: entity.occurredAt,
      crisisSeverity: entity.crisisSeverity
    };
  }

  static toEntitiesFromResponse(
    resources: ObservationResource[]
  ): Observation[] {
    return resources.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}

export class PsychologistCommentAssembler {
  static toEntityFromResource(
    resource: PsychologistCommentResource
  ): PsychologistComment {
    return new PsychologistComment(resource);
  }

  static toResourceFromEntity(
    entity: PsychologistComment
  ): PsychologistCommentResource {
    return {
      id: entity.id,
      observationId: entity.observationId,
      psychologistId: entity.psychologistId,
      content: entity.content,
      createdAt: entity.createdAt
    };
  }
}

export class ObservationEvidenceAssembler {
  static toEntityFromResource(
    resource: ObservationEvidenceResource
  ): ObservationEvidence {
    return new ObservationEvidence(resource);
  }

  static toResourceFromEntity(
    entity: ObservationEvidence
  ): ObservationEvidenceResource {
    return {
      id: entity.id,
      observationId: entity.observationId,
      fileName: entity.fileName,
      fileUrl: entity.fileUrl,
      uploadedAt: entity.uploadedAt
    };
  }
}
