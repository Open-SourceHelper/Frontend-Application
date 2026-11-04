import {ChildResource} from '../responses/child-response';
import {Child} from '../../domain/model/child.entity';
import {DateTime} from '../../../shared/domain/model/date-time';

export class ChildAssembler {
  static toEntityFromResource(
    resource: ChildResource
  ): Child {
    return new Child(
      resource.id,
      resource.parentId,
      resource.firstName,
      resource.lastName,
      new Date(resource.birthDate),
      new DateTime(resource.createdAt)
    );
  }

  static toResourceFromEntity(
    entity: Child
  ): ChildResource {
    return {
      id: entity.id,
      parentId: entity.parentId,
      firstName: entity.firstName,
      lastName: entity.lastName,
      birthDate: entity.birthDate.toISOString(),
      createdAt: entity.createdAt.toString()
    };
  }

  static toEntitiesFromResponse(
    response: ChildResource[]
  ): Child[] {
    return response.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
