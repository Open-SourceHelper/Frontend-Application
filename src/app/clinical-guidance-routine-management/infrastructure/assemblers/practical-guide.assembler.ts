import { PracticalGuide } from '../../domain/model/practical-guide.entity';
import { PracticalGuideResource } from '../resources/practical-guide.resource';

export class PracticalGuideAssembler {

  static toEntityFromResource(
    resource: PracticalGuideResource
  ): PracticalGuide {
    return new PracticalGuide(
      resource.id,
      resource.title,
      resource.category,
      resource.content,
      resource.status ?? 'ACTIVE',
      resource.createdAt ? new Date(resource.createdAt) : new Date(0),
      resource.updatedAt ? new Date(resource.updatedAt) : new Date(0)
    );
  }

  static toResourceFromEntity(
    entity: PracticalGuide
  ): PracticalGuideResource {
    return {
      id: entity.id,
      title: entity.title,
      category: entity.category,
      content: entity.content,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  static toEntitiesFromResponse(
    resources: PracticalGuideResource[]
  ): PracticalGuide[] {
    return resources.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
