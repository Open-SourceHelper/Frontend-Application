import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {Routine} from '../domain/model/routine.entity';
import {RoutineActivity} from '../domain/model/routine-activity.entity';
import {VisualSupport} from '../domain/model/visual-support.entity';
import {RoutinesApiEndpoint} from './routines-api-endpoint';
import {RoutineActivitiesApiEndpoint} from './routine-activities-api-endpoint';
import {VisualSupportsApiEndpoint} from './visual-supports-api-endpoint';

/**
 * Infrastructure facade for routine, activity and visual support endpoint operations.
 */
@Service()
export class RoutineActivityService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly routinesEndpoint = new RoutinesApiEndpoint(this.http);
  private readonly activitiesEndpoint = new RoutineActivitiesApiEndpoint(this.http);
  private readonly visualSupportsEndpoint = new VisualSupportsApiEndpoint(this.http);

  /** Retrieves all routines. */
  getRoutines = (): Observable<Routine[]> =>
    this.routinesEndpoint.getAll();

  /** Creates a routine. */
  createRoutine = (routine: Routine): Observable<Routine> =>
    this.routinesEndpoint.create(routine);

  /** Updates a routine. */
  updateRoutine = (routine: Routine): Observable<Routine> =>
    this.routinesEndpoint.update(routine, routine.id);

  /** Deletes a routine by ID. */
  deleteRoutine = (id: number): Observable<void> =>
    this.routinesEndpoint.delete(id);

  /** Retrieves all routine activities. */
  getActivities = (): Observable<RoutineActivity[]> =>
    this.activitiesEndpoint.getAll();

  /** Creates a routine activity. */
  createActivity = (activity: RoutineActivity): Observable<RoutineActivity> =>
    this.activitiesEndpoint.create(activity);

  /** Updates a routine activity. */
  updateActivity = (activity: RoutineActivity): Observable<RoutineActivity> =>
    this.activitiesEndpoint.update(activity, activity.id);

  /** Deletes a routine activity by ID. */
  deleteActivity = (id: number): Observable<void> =>
    this.activitiesEndpoint.delete(id);

  /** Retrieves all visual supports. */
  getVisualSupports = (): Observable<VisualSupport[]> =>
    this.visualSupportsEndpoint.getAll();

  /** Creates a visual support. */
  createVisualSupport = (visualSupport: VisualSupport): Observable<VisualSupport> =>
    this.visualSupportsEndpoint.create(visualSupport);

  /** Deletes a visual support by ID. */
  deleteVisualSupport = (id: number): Observable<void> =>
    this.visualSupportsEndpoint.delete(id);
}
