import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ClinicalGuideline } from '../../../domain/model/clinical-guideline.entity';
import { GuidelineStatus } from '../../../domain/model/guideline-status';

@Component({
  selector: 'app-clinical-guideline-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './clinical-guideline-form.html',
  styleUrl: './clinical-guideline-form.css'
})
export class ClinicalGuidelineForm {
  private readonly formBuilder = inject(FormBuilder);

  @Output() guidelineCreated = new EventEmitter<ClinicalGuideline>();

  readonly form = this.formBuilder.nonNullable.group({
    psychologistId: ['', Validators.required],
    childId: ['', Validators.required],
    instructions: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { psychologistId, childId, instructions } = this.form.getRawValue();

    const guideline = new ClinicalGuideline(
      crypto.randomUUID(),
      psychologistId.trim(),
      childId.trim(),
      instructions.trim(),
      GuidelineStatus.DRAFT
    );

    if (!guideline.registrarPauta()) {
      return;
    }

    this.guidelineCreated.emit(guideline);
    this.form.reset();
  }
}
