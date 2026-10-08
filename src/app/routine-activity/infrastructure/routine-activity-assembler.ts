import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {RoutineActivity} from '../domain/model/routine-activity.entity';
import {ActivityStatus} from '../domain/model/activity-status';
import {AlertType} from '../domain/model/alert-type';
import {RoutineActivitiesResponse, RoutineActivityResource} from './routine-activities-response';

/**
 * Maps routine activity entities to and from API resources.
 */
export class RoutineActivityAssembler
  implements BaseAssembler<RoutineActivity, RoutineActivityResource, RoutineActivitiesResponse> {

  /**
   * Converts a RoutineActivitiesResponse to an array of RoutineActivity entities.
   * @param response - The API response containing activities.
   * @returns An array of RoutineActivity entities.
   */
  toEntitiesFromResponse = (response: RoutineActivitiesResponse): RoutineActivity[] =>
    response.activities.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a RoutineActivityResource to a RoutineActivity entity.
   * @param resource - The resource to convert.
   * @returns The converted RoutineActivity entity.
   */
  toEntityFromResource = (resource: RoutineActivityResource): RoutineActivity =>
    new RoutineActivity({
      id: resource.id,
      routineId: resource.routineId,
      name: resource.name,
      description: resource.description,
      activityOrder: resource.activityOrder,
      durationMinutes: resource.durationMinutes,
      status: resource.status as ActivityStatus,
      transitionDurationMinutes: resource.transitionDurationMinutes,
      alertType: resource.alertType as AlertType,
      completedAt: resource.completedAt ? new Date(resource.completedAt) : null
    });

  /**
   * Converts a RoutineActivity entity to a RoutineActivityResource.
   * @param entity - The entity to convert.
   * @returns The converted RoutineActivityResource.
   */
  toResourceFromEntity = (entity: RoutineActivity): RoutineActivityResource =>
    ({
      id: entity.id,
      routineId: entity.routineId,
      name: entity.name,
      description: entity.description,
      activityOrder: entity.activityOrder,
      durationMinutes: entity.durationMinutes,
      status: entity.status,
      transitionDurationMinutes: entity.transitionDurationMinutes,
      alertType: entity.alertType,
      completedAt: entity.completedAt ? entity.completedAt.toISOString() : null
    } as RoutineActivityResource);
}
