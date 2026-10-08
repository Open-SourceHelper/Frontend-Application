import {Component, effect, inject, signal} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {RoutineActivityStore, VisualSupportDraft} from '../../../application/routine-activity.store';
import {Routine} from '../../../domain/model/routine.entity';
import {RoutineActivity} from '../../../domain/model/routine-activity.entity';
import {RoutineStatus} from '../../../domain/model/routine-status';
import {AlertType} from '../../../domain/model/alert-type';
import {VisualSupport} from '../../../domain/model/visual-support.entity';

/**
 * Shape of one activity row of the form.
 */
type ActivityFormGroup = FormGroup<{
  id: FormControl<number>;
  name: FormControl<string>;
  description: FormControl<string>;
  activityOrder: FormControl<number>;
  durationMinutes: FormControl<number>;
  transitionDurationMinutes: FormControl<number>;
  alertType: FormControl<AlertType>;
}>;

/**
 * Creates and edits routines with their activities and visual supports (US15, US27, US31).
 */
@Component({
  selector: 'app-routine-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatInput, MatIcon, MatCardModule],
  templateUrl: './routine-form.html',
  styleUrls: ['../../routine-theme.css', './routine-form.css']
})
export class RoutineForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(RoutineActivityStore);

  protected readonly AlertType = AlertType;
  protected readonly acceptedFormats = VisualSupport.ALLOWED_FORMATS.join(',');

  /**
   * Form-group for the routine form.
   */
  form = this.fb.group({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    description: new FormControl<string>('', {nonNullable: true}),
    childId: new FormControl<string>(this.route.snapshot.queryParamMap.get('childId') ?? '', {nonNullable: true, validators: [Validators.required]}),
    activities: new FormArray<ActivityFormGroup>([])
  });

  /**
   * New image selected for each activity row (null when it was not changed).
   */
  readonly images = signal<(VisualSupportDraft | null)[]>([]);

  /**
   * Image currently persisted for each activity row (edit mode).
   */
  readonly currentImages = signal<(string | null)[]>([]);

  /**
   * Business-rule error shown when the routine is not valid.
   */
  readonly formError = signal<string | null>(null);

  /**
   * Indicates if the form is in edit mode.
   */
  readonly isEdit: boolean;

  /**
   * The ID of the routine being edited, or null for new routines.
   */
  readonly routineId: number | null;

  private status: RoutineStatus = RoutineStatus.ACTIVE;
  private originalRoutineId: number | null = null;
  private createdAt = new Date();
  private originalActivities: RoutineActivity[] = [];
  private patched = false;

  /**
   * Creates an instance of RoutineForm and initializes the form based on route parameters.
   */
  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.routineId = id ? +id : null;
    this.isEdit = !!this.routineId;
    if (!this.isEdit) {
      this.addActivity();
      return;
    }
    const routine = this.store.getRoutineById(this.routineId!);
    // The store may still be loading when the page is opened directly: patch once it is available.
    effect(() => {
      const current = routine();
      if (current && !this.patched) {
        this.patched = true;
        this.patchRoutine(current);
      }
    });
  }

  /**
   * Activity rows of the form.
   */
  get activities(): FormArray<ActivityFormGroup> {
    return this.form.controls.activities;
  }

  /**
   * Adds an empty activity row.
   */
  addActivity(activity?: RoutineActivity): void {
    this.activities.push(this.fb.group({
      id: new FormControl<number>(activity?.id ?? 0, {nonNullable: true}),
      name: new FormControl<string>(activity?.name ?? '', {nonNullable: true, validators: [Validators.required]}),
      description: new FormControl<string>(activity?.description ?? '', {nonNullable: true}),
      activityOrder: new FormControl<number>(activity?.activityOrder ?? this.activities.length + 1,
        {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
      durationMinutes: new FormControl<number>(activity?.durationMinutes ?? 5,
        {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
      transitionDurationMinutes: new FormControl<number>(activity?.transitionDurationMinutes ?? 1,
        {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
      alertType: new FormControl<AlertType>(activity?.alertType ?? AlertType.VISUAL, {nonNullable: true})
    }));
    this.images.update(images => [...images, null]);
    this.currentImages.update(images => [...images, activity?.mainVisualSupport?.fileUrl ?? null]);
  }

  /**
   * Removes an activity row.
   * @param index - Row index.
   */
  removeActivity(index: number): void {
    this.activities.removeAt(index);
    this.images.update(images => images.filter((_, i) => i !== index));
    this.currentImages.update(images => images.filter((_, i) => i !== index));
  }

  /**
   * Reads the selected image as a data URL (fake storage until Amazon S3 is integrated) (US27).
   * @param index - Row index.
   * @param event - File input change event.
   */
  selectImage(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!VisualSupport.ALLOWED_FORMATS.includes(file.type)) {
      this.formError.set('El apoyo visual debe ser una imagen JPG o PNG.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.formError.set(null);
      this.images.update(images => images.map((image, i) =>
        i === index ? {fileUrl: reader.result as string, fileFormat: file.type} : image));
    };
    reader.readAsDataURL(file);
  }

  /**
   * Preview of the image of a row (new one first, then the persisted one).
   * @param index - Row index.
   */
  preview(index: number): string | null {
    return this.images()[index]?.fileUrl ?? this.currentImages()[index] ?? null;
  }

  /**
   * Submits the form to create or update the routine.
   */
  submit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const activities = value.activities.map(activity => {
      // Editing the structure keeps the execution state of the existing activities.
      const original = this.originalActivities.find(a => a.id === activity.id);
      return new RoutineActivity({
        ...activity,
        routineId: this.routineId ?? 0,
        status: original?.status,
        completedAt: original?.completedAt
      });
    });
    const routine = new Routine({
      id: this.routineId ?? 0,
      childId: value.childId.trim(),
      originalRoutineId: this.originalRoutineId,
      name: value.name.trim(),
      description: value.description.trim(),
      status: this.status,
      createdAt: this.createdAt,
      activities
    });

    if (!routine.esValida()) {
      this.formError.set('La rutina necesita al menos una actividad, con duraciones válidas y sin órdenes repetidos.');
      return;
    }

    if (this.isEdit) {
      const keptIds = activities.map(activity => activity.id).filter(id => id);
      const removedIds = this.originalActivities.map(a => a.id).filter(id => !keptIds.includes(id));
      this.store.updateRoutine(routine, this.images(), removedIds);
    } else {
      this.store.addRoutine(routine, this.images());
    }
    this.router.navigate(['routine-activity/routines'], {queryParams: {childId: routine.childId}}).then();
  }

  /**
   * Returns to the routine list.
   */
  cancel() {
    this.router.navigate(['routine-activity/routines']).then();
  }

  private patchRoutine(routine: Routine): void {
    this.status = routine.status;
    this.originalRoutineId = routine.originalRoutineId;
    this.createdAt = routine.createdAt;
    this.originalActivities = routine.activities;
    this.form.patchValue({name: routine.name, description: routine.description, childId: routine.childId});
    this.activities.clear();
    this.images.set([]);
    this.currentImages.set([]);
    routine.consultarActividades().forEach(activity => this.addActivity(activity));
  }
}
