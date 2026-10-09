import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {VisualSupport} from '../domain/model/visual-support.entity';
import {VisualSupportResource, VisualSupportsResponse} from './visual-supports-response';

/**
 * Maps visual support entities to and from API resources.
 */
export class VisualSupportAssembler
  implements BaseAssembler<VisualSupport, VisualSupportResource, VisualSupportsResponse> {

  /**
   * Converts a VisualSupportsResponse to an array of VisualSupport entities.
   * @param response - The API response containing visual supports.
   * @returns An array of VisualSupport entities.
   */
  toEntitiesFromResponse = (response: VisualSupportsResponse): VisualSupport[] =>
    response.visualSupports.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a VisualSupportResource to a VisualSupport entity.
   * @param resource - The resource to convert.
   * @returns The converted VisualSupport entity.
   */
  toEntityFromResource = (resource: VisualSupportResource): VisualSupport =>
    new VisualSupport({
      id: resource.id,
      activityId: resource.activityId,
      fileUrl: resource.fileUrl,
      fileFormat: resource.fileFormat,
      createdAt: new Date(resource.createdAt)
    });

  /**
   * Converts a VisualSupport entity to a VisualSupportResource.
   * @param entity - The entity to convert.
   * @returns The converted VisualSupportResource.
   */
  toResourceFromEntity = (entity: VisualSupport): VisualSupportResource =>
    ({
      id: entity.id,
      activityId: entity.activityId,
      fileUrl: entity.fileUrl,
      fileFormat: entity.fileFormat,
      createdAt: entity.createdAt.toISOString()
    } as VisualSupportResource);
}
