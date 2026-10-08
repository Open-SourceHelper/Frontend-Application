import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Routine} from '../domain/model/routine.entity';
import {RoutineStatus} from '../domain/model/routine-status';
import {RoutineResource, RoutinesResponse} from './routines-response';

/**
 * Maps routine entities to and from API resources.
 */
export class RoutineAssembler implements BaseAssembler<Routine, RoutineResource, RoutinesResponse> {

  /**
   * Converts a RoutinesResponse to an array of Routine entities.
   * @param response - The API response containing routines.
   * @returns An array of Routine entities.
   */
  toEntitiesFromResponse = (response: RoutinesResponse): Routine[] =>
    response.routines.map(resource => this.toEntityFromResource(resource));

  /**
   * Converts a RoutineResource to a Routine entity.
   * @param resource - The resource to convert.
   * @returns The converted Routine entity.
   */
  toEntityFromResource = (resource: RoutineResource): Routine =>
    new Routine({
      id: resource.id,
      childId: resource.childId,
      originalRoutineId: resource.originalRoutineId,
      name: resource.name,
      description: resource.description,
      status: resource.status as RoutineStatus,
      createdAt: new Date(resource.createdAt)
    });

  /**
   * Converts a Routine entity to a RoutineResource.
   * @param entity - The entity to convert.
   * @returns The converted RoutineResource.
   */
  toResourceFromEntity = (entity: Routine): RoutineResource =>
    ({
      id: entity.id,
      childId: entity.childId,
      originalRoutineId: entity.originalRoutineId,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt.toISOString()
    } as RoutineResource);
}
