import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Child } from '../../../../domain/model/child.entity';
import {DateTime} from '../../../../../shared/domain/model/date-time';

@Component({
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  selector: 'app-child-form',
  styleUrl: './child-form.css',
  templateUrl: './child-form.html',
})
export class ChildForm {
  private readonly formBuilder = inject(FormBuilder);

  @Output() childCreated = new EventEmitter<Child>();

  readonly form = this.formBuilder.nonNullable.group({
    parentId: ['', [Validators.required, Validators.pattern(/\S/)]],
    firstName: ['', [Validators.required, Validators.pattern(/\S/)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/)]],
    birthDate: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { parentId, firstName, lastName, birthDate } = this.form.getRawValue();
    const [year, month, day] = birthDate.split('-').map(Number);
    const parsedBirthDate = new Date(year, month - 1, day);

    const invalidDate =
      Number.isNaN(parsedBirthDate.getTime()) ||
      parsedBirthDate.getFullYear() !== year ||
      parsedBirthDate.getMonth() !== month - 1 ||
      parsedBirthDate.getDate() !== day;

    if (invalidDate) {
      this.form.controls.birthDate.setErrors({ invalidDate: true });
      this.form.controls.birthDate.markAsTouched();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedBirthDate > today) {
      this.form.controls.birthDate.setErrors({ futureDate: true });
      this.form.controls.birthDate.markAsTouched();
      return;
    }

    const child = new Child(
      crypto.randomUUID(),
      parentId.trim(),
      firstName.trim(),
      lastName.trim(),
      parsedBirthDate,
      new DateTime(),
    );

    this.childCreated.emit(child);
    this.form.reset();
  }
}
