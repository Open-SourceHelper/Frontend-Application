import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {RoutineActivity} from '../domain/model/routine-activity.entity';
import {RoutineActivityResource, RoutineActivitiesResponse} from './routine-activities-response';
import {RoutineActivityAssembler} from './routine-activity-assembler';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for routine activity CRUD operations.
 */
export class RoutineActivitiesApiEndpoint extends BaseApiEndpoint<RoutineActivity, RoutineActivityResource, RoutineActivitiesResponse, RoutineActivityAssembler> {
  /**
   * Creates an instance of RoutineActivitiesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderRoutineActivitiesEndpointPath}`, new RoutineActivityAssembler());
  }
}
