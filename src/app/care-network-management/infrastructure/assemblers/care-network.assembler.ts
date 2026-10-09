
import { CareNetwork } from '../../domain/model/care-network.entity';
import { CareNetworkResource } from '../resources/care-network.resource';

export class CareNetworkAssembler {

  static toEntityFromResource(
    resource: CareNetworkResource
  ): CareNetwork {
    return new CareNetwork(
      resource.id,
      resource.parentId,
      resource.childId,
      resource.name
    );
  }

  static toResourceFromEntity(
    entity: CareNetwork
  ): CareNetworkResource {
    return {
      id: entity.id,
      parentId: entity.parentId,
      childId: entity.childId,
      name: entity.name
    };
  }

  static toEntitiesFromResponse(
    response: CareNetworkResource[]
  ): CareNetwork[] {
    return response.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
