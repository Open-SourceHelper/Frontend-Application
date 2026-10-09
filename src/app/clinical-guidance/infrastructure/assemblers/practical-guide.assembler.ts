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
      resource.content
    );
  }

  static toResourceFromEntity(
    entity: PracticalGuide
  ): PracticalGuideResource {
    return {
      id: entity.id,
      title: entity.title,
      category: entity.category,
      content: entity.content
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
