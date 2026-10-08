import {computed, inject, Service, Signal, signal} from '@angular/core';
import {forkJoin, Observable, of, retry, switchMap} from 'rxjs';
import {map} from 'rxjs/operators';
import {Routine} from '../domain/model/routine.entity';
import {RoutineActivity} from '../domain/model/routine-activity.entity';
import {VisualSupport} from '../domain/model/visual-support.entity';
import {AlertType} from '../domain/model/alert-type';
import {RoutineActivityService} from '../infrastructure/routine-activity.service';

/**
 * Image selected in the UI that has not been persisted yet (US27).
 */
export interface VisualSupportDraft {
  fileUrl: string;
  fileFormat: string;
}

/**
 * Runs several requests in parallel. Unlike forkJoin, it also emits when the list is empty.
 */
const all = <T>(requests: Observable<T>[]): Observable<T[]> =>
  requests.length ? forkJoin(requests) : of([]);

/**
 * Retries a request a few times with a short delay.
 *
 * @remarks
 * json-server --watch restarts after every write, so chained requests can briefly fail.
 */
const persist = <T>(request: Observable<T>): Observable<T> =>
  request.pipe(retry({count: 3, delay: 500}));

/**
 * Holds Routine & Activity Management application state and coordinates its use cases.
 */
@Service()
export class RoutineActivityStore {
  private readonly routineActivityService = inject(RoutineActivityService);

  private readonly routinesSignal = signal<Routine[]>([]);
  private readonly activitiesSignal = signal<RoutineActivity[]>([]);
  private readonly visualSupportsSignal = signal<VisualSupport[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for the routines, each one composed with its ordered activities
   * and every activity composed with its visual supports.
   */
  readonly routines = computed(() => this.routinesSignal().map(routine => this.composeRoutine(routine)));

  /**
   * Computed signal for the count of routines.
   */
  readonly routineCount = computed(() => this.routines().length);

  /**
   * Readonly signal indicating if data is loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Creates an instance of RoutineActivityStore and loads initial data.
   */
  constructor() {
    this.loadAll();
  }

  /**
   * Selects a routine by identifier.
   * @param id - Routine identifier.
   * @returns Reactive selection for the requested routine.
   */
  getRoutineById = (id: number): Signal<Routine | undefined> =>
    computed(() => id ? this.routines().find(routine => routine.id === id) : undefined);

  /**
   * Selects the routines of a child (reference to Child Profile Management).
   * @param childId - Child identifier, or null to select all routines.
   * @returns Reactive selection of routines.
   */
  getRoutinesByChildId = (childId: Signal<string | null>): Signal<Routine[]> =>
    computed(() => {
      const id = childId();
      return id ? this.routines().filter(routine => routine.childId === id) : this.routines();
    });

  /**
   * Creates a routine with its activities and their visual supports (US15, US27).
   * @param routine - Routine with the activities to create.
   * @param images - Image per activity, in the same order as routine.activities.
   */
  addRoutine = (routine: Routine, images: (VisualSupportDraft | null)[] = []): void => {
    const activities = routine.activities;
    this.run('Failed to create routine',
      persist(this.routineActivityService.createRoutine(routine)).pipe(
        switchMap(created => all(activities.map(activity => {
          activity.routineId = created.id;
          return persist(this.routineActivityService.createActivity(activity));
        }))),
        switchMap(createdActivities => this.saveImages(createdActivities, images))
      ));
  };

  /**
   * Updates a routine and synchronizes its activities and visual supports (US15, US27).
   * @param routine - Routine with the current list of activities (new ones have id 0).
   * @param images - Image per activity, in the same order as routine.activities.
   * @param removedActivityIds - Activities removed in the form.
   */
  updateRoutine = (routine: Routine, images: (VisualSupportDraft | null)[], removedActivityIds: number[]): void => {
    const activities = routine.activities;
    this.run('Failed to update routine',
      persist(this.routineActivityService.updateRoutine(routine)).pipe(
        switchMap(() => all(removedActivityIds.map(id => this.deleteActivityWithSupports(id)))),
        switchMap(() => all(activities.map(activity => {
          activity.routineId = routine.id;
          return activity.id
            ? persist(this.routineActivityService.updateActivity(activity))
            : persist(this.routineActivityService.createActivity(activity));
        }))),
        switchMap(savedActivities => this.saveImages(savedActivities, images))
      ));
  };

  /**
   * Duplicates a routine as a draft, including its activities and images (US28).
   * @param id - Identifier of the routine to duplicate.
   */
  duplicateRoutine = (id: number): void => {
    const routine = this.getRoutineById(id)();
    if (!routine) return;
    const copy = routine.duplicarRutina();
    const images = routine.consultarActividades().map(activity => activity.mainVisualSupport
      ? {fileUrl: activity.mainVisualSupport.fileUrl, fileFormat: activity.mainVisualSupport.fileFormat}
      : null);
    this.addRoutine(copy, images);
  };

  /**
   * Activates a routine.
   * @param id - Routine identifier.
   */
  activateRoutine = (id: number): void => {
    const routine = this.getRoutineById(id)();
    if (!routine) return;
    routine.activar();
    this.saveRoutineStatus(routine);
  };

  /**
   * Inactivates a routine (US46).
   * @param id - Routine identifier.
   */
  deactivateRoutine = (id: number): void => {
    const routine = this.getRoutineById(id)();
    if (!routine) return;
    routine.desactivar();
    this.saveRoutineStatus(routine);
  };

  /**
   * Deletes an inactive routine with its activities and visual supports (US29).
   * @param id - Routine identifier.
   */
  deleteRoutine = (id: number): void => {
    const routine = this.getRoutineById(id)();
    if (!routine) return;
    if (!routine.canBeDeleted) {
      this.errorSignal.set('Solo se pueden eliminar rutinas inactivas.');
      return;
    }
    this.run('Failed to delete routine',
      all(routine.activities.map(activity => this.deleteActivityWithSupports(activity.id))).pipe(
        switchMap(() => persist(this.routineActivityService.deleteRoutine(id)))
      ));
  };

  /**
   * Marks an activity as completed (US14).
   * @param routineId - Routine identifier.
   * @param activityId - Activity identifier.
   */
  completeActivity = (routineId: number, activityId: number): void =>
    this.changeActivity(routineId, activityId, activity => activity.completarActividad());

  /**
   * Marks an activity as skipped (US30).
   * @param routineId - Routine identifier.
   * @param activityId - Activity identifier.
   */
  skipActivity = (routineId: number, activityId: number): void =>
    this.changeActivity(routineId, activityId, activity => activity.omitirActividad());

  /**
   * Configures the alert type of an activity timer (US31).
   * @param routineId - Routine identifier.
   * @param activityId - Activity identifier.
   * @param type - Alert type.
   */
  configureAlert = (routineId: number, activityId: number, type: AlertType): void =>
    this.changeActivity(routineId, activityId, activity => activity.configurarAlerta(type));

  /**
   * Loads routines, activities and visual supports from the API.
   */
  loadAll = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    forkJoin([
      this.routineActivityService.getRoutines(),
      this.routineActivityService.getActivities(),
      this.routineActivityService.getVisualSupports()
    ]).pipe(retry({count: 3, delay: 500})).subscribe({
      next: ([routines, activities, visualSupports]) => {
        this.routinesSignal.set(routines);
        this.activitiesSignal.set(activities);
        this.visualSupportsSignal.set(visualSupports);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load routines'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Persists a change of status of a routine.
   */
  private saveRoutineStatus = (routine: Routine): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.routineActivityService.updateRoutine(routine).pipe(retry({count: 3, delay: 500})).subscribe({
      next: updated => {
        this.routinesSignal.update(routines => routines.map(r => r.id === updated.id ? updated : r));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update routine'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Applies a domain operation to an activity and persists it.
   */
  private changeActivity = (routineId: number, activityId: number, operation: (activity: RoutineActivity) => void): void => {
    const activity = this.getRoutineById(routineId)()?.activities.find(a => a.id === activityId);
    if (!activity) return;
    operation(activity);
    this.errorSignal.set(null);
    this.routineActivityService.updateActivity(activity).pipe(retry({count: 3, delay: 500})).subscribe({
      next: updated => this.activitiesSignal.update(activities => activities.map(a => a.id === updated.id ? updated : a)),
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to update activity'))
    });
  };

  /**
   * Replaces the visual support of each activity that received a new image.
   */
  private saveImages = (activities: RoutineActivity[], images: (VisualSupportDraft | null)[]): Observable<unknown> =>
    all(activities.map((activity, index) => {
      const image = images[index];
      if (!image) return of(null);
      const visualSupport = new VisualSupport({id: 0, activityId: activity.id, ...image});
      if (!visualSupport.validarFormato()) return of(null);
      const previous = this.visualSupportsSignal().filter(vs => vs.activityId === activity.id);
      return all(previous.map(vs => persist(this.routineActivityService.deleteVisualSupport(vs.id)))).pipe(
        switchMap(() => persist(this.routineActivityService.createVisualSupport(visualSupport)))
      );
    }));

  /**
   * Deletes an activity and its visual supports.
   */
  private deleteActivityWithSupports = (activityId: number): Observable<void> => {
    const supports = this.visualSupportsSignal().filter(vs => vs.activityId === activityId);
    return all(supports.map(vs => persist(this.routineActivityService.deleteVisualSupport(vs.id)))).pipe(
      switchMap(() => persist(this.routineActivityService.deleteActivity(activityId)))
    );
  };

  /**
   * Executes a compound operation and reloads the state when it finishes.
   */
  private run = (fallback: string, operation: Observable<unknown>): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    operation.pipe(map(() => undefined)).subscribe({
      next: () => this.loadAll(),
      error: err => {
        // Part of the operation may have been persisted: reload and keep the error visible.
        this.loadAll();
        this.errorSignal.set(this.formatError(err, fallback));
      }
    });
  };

  /**
   * Builds a fresh Routine instance with its activities, so signals always notify changes.
   */
  private composeRoutine = (routine: Routine): Routine =>
    new Routine({
      id: routine.id,
      childId: routine.childId,
      originalRoutineId: routine.originalRoutineId,
      name: routine.name,
      description: routine.description,
      status: routine.status,
      createdAt: routine.createdAt,
      activities: this.activitiesSignal()
        .filter(activity => activity.routineId === routine.id)
        .sort((a, b) => a.activityOrder - b.activityOrder)
        .map(activity => this.composeActivity(activity))
    });

  /**
   * Builds a fresh RoutineActivity instance with its visual supports.
   */
  private composeActivity = (activity: RoutineActivity): RoutineActivity =>
    new RoutineActivity({
      id: activity.id,
      routineId: activity.routineId,
      name: activity.name,
      description: activity.description,
      activityOrder: activity.activityOrder,
      durationMinutes: activity.durationMinutes,
      status: activity.status,
      transitionDurationMinutes: activity.transitionDurationMinutes,
      alertType: activity.alertType,
      completedAt: activity.completedAt,
      visualSupports: this.visualSupportsSignal().filter(vs => vs.activityId === activity.id)
    });

  /**
   * Normalizes unknown errors into a display-friendly message.
   * @param error - Source error.
   * @param fallback - Default message when details are unavailable.
   * @returns Normalized message.
   */
  private formatError = (error: unknown, fallback: string): string => {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  };
}
