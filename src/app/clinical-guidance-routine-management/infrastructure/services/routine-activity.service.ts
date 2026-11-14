import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Routine } from '../../domain/model/routine.entity';
import { RoutineActivity } from '../../domain/model/routine-activity.entity';
import { VisualSupport } from '../../domain/model/visual-support.entity';
import { RoutineService } from './routine.service';
import { RoutineActivityResourceService } from './routine-activity-resource.service';
import { VisualSupportService } from './visual-support.service';

/** Facade for the routine aggregate and its activity/visual-support API operations. */
@Injectable({ providedIn: 'root' })
export class RoutineActivityService {
  private readonly routines = inject(RoutineService);
  private readonly activities = inject(RoutineActivityResourceService);
  private readonly visualSupports = inject(VisualSupportService);

  getRoutines(): Observable<Routine[]> { return this.routines.getAll(); }
  createRoutine(routine: Routine): Observable<Routine> { return this.routines.create(routine); }
  updateRoutine(routine: Routine): Observable<Routine> { return this.routines.update(routine); }
  deleteRoutine(id: number): Observable<void> { return this.routines.delete(id); }

  getActivities(): Observable<RoutineActivity[]> { return this.activities.getAll(); }
  createActivity(activity: RoutineActivity): Observable<RoutineActivity> { return this.activities.create(activity); }
  updateActivity(activity: RoutineActivity): Observable<RoutineActivity> { return this.activities.update(activity); }
  deleteActivity(id: number): Observable<void> { return this.activities.delete(id); }

  getVisualSupports(): Observable<VisualSupport[]> { return this.visualSupports.getAll(); }
  createVisualSupport(item: VisualSupport): Observable<VisualSupport> { return this.visualSupports.create(item); }
  deleteVisualSupport(id: number): Observable<void> { return this.visualSupports.delete(id); }
}
