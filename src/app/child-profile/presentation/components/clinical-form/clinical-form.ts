import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DateTime} from '../../../../shared/domain/model/date-time';
import {ClinicalProfile} from '../../../domain/model/clinical-profile.entity';

@Component({
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule],
  selector: 'app-clinical-form',
  styleUrl: './clinical-form.css',
  templateUrl: './clinical-form.html',
})
export class ClinicalForm {
  private readonly formBuilder = inject(FormBuilder);

  @Output() clinicalCreated = new EventEmitter<ClinicalProfile>();

  readonly form = this.formBuilder.nonNullable.group({
    childId: ['', [Validators.required, Validators.pattern(/\S/)]],
    specialNeeds: ['', [Validators.required, Validators.pattern(/\S/)]],
    triggers: ['', [Validators.required, Validators.pattern(/\S/)]],
    regulators: ['', [Validators.required, Validators.pattern(/\S/)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { childId, specialNeeds, triggers, regulators } = this.form.getRawValue();

    const clinical = new ClinicalProfile(
      crypto.randomUUID(),
      childId.trim(),
      specialNeeds.trim(),
      triggers.trim(),
      regulators.trim(),
      new DateTime(),
    );

    this.clinicalCreated.emit(clinical);
    this.form.reset();
  }
}
