import { Routine } from '../../domain/model/routine.entity';
import { RoutineResource } from '../resources/routine-resource';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../../shared/infrastructure/base-response';
import { Injectable } from '@angular/core';

export interface RoutineResponse extends BaseResponse {
  content: RoutineResource[];
}
@Injectable({
  providedIn: 'root'
})
export class RoutineAssembler
  implements BaseAssembler<Routine, RoutineResource, RoutineResponse> {

  toEntityFromResource(resource: RoutineResource): Routine {
    return new Routine(
      resource.id,
      resource.childId,
      resource.name,
      resource.status,
      []
    );
  }

  toResourceFromEntity(entity: Routine): RoutineResource {
    return {
      id: entity.id,
      childId: entity.childId,
      name: entity.name,
      status: entity.status,
      activityIds: entity.activities.map(activity => activity.id)
    };
  }

  toEntitiesFromResponse(response: RoutineResponse): Routine[] {
    return response.content.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
