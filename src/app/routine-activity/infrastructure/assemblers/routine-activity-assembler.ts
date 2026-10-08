import { RoutineActivity } from '../../domain/model/routine-activity.entity';
import { ActivityStatus } from '../../domain/model/activity-status';
import { AlertType } from '../../domain/model/alert-type';
import { Duration } from '../../domain/model/duration';
import { RoutineActivityResource } from '../resources/routine-activity-resource';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { BaseResponse } from '../../../shared/infrastructure/base-response';

export interface RoutineActivityResponse extends BaseResponse {
  content: RoutineActivityResource[];
}

export class RoutineActivityAssembler
  implements BaseAssembler<RoutineActivity, RoutineActivityResource, RoutineActivityResponse> {

  toEntityFromResource(resource: RoutineActivityResource): RoutineActivity {
    return new RoutineActivity(
      resource.id,
      resource.routineId,
      resource.title,
      resource.order,
      new Duration(resource.durationMinutes),
      resource.status,
      resource.timerEnabled,
      resource.alertType
    );
  }

  toResourceFromEntity(entity: RoutineActivity): RoutineActivityResource {
    return {
      id: entity.id,
      routineId: entity.routineId,
      title: entity.title,
      order: entity.order,
      durationMinutes: entity.duration.toMinutes(),
      status: entity.status,
      timerEnabled: entity.timerEnabled,
      alertType: entity.alertType,
      visualSupportId: entity.visualSupport?.id
    };
  }

  toEntitiesFromResponse(
    response: RoutineActivityResponse
  ): RoutineActivity[] {
    return response.content.map(resource =>
      this.toEntityFromResource(resource)
    );
  }
}
