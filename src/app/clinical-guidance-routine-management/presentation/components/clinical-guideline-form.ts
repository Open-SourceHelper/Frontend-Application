import { Component, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ClinicalGuideline } from '../../domain/model/clinical-guideline.entity';
import { GuidelineStatus } from '../../domain/model/guideline-status';
import { PatientAssignmentStore } from '../../application/patient-assignment.store';

/** A draft can only be created against a currently active patient assignment. */
@Component({
  selector: 'app-clinical-guideline-form',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './clinical-guideline-form.html',
  styleUrl: './clinical-guideline-form.css'
})
export class ClinicalGuidelineForm {
  private readonly fb = inject(FormBuilder);
  readonly assignments = inject(PatientAssignmentStore);
  readonly activeAssignments = computed(() => this.assignments.assignments()
    .filter(assignment => assignment.verificarAsignacion()));
  readonly formError = signal<string | null>(null);

  @Output() guidelineCreated = new EventEmitter<ClinicalGuideline>();

  readonly form = this.fb.nonNullable.group({
    patientAssignmentId: ['', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(150)]],
    instructions: ['', Validators.required]
  });

  onSubmit(): void {
    this.formError.set(null);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (!this.assignments.loaded() || this.assignments.error()) {
      this.formError.set('No se pudieron verificar las asignaciones activas.');
      return;
    }
    const { patientAssignmentId, title, instructions } = this.form.getRawValue();
    const assignment = this.activeAssignments().find(item => item.id === patientAssignmentId);
    if (!assignment) {
      this.formError.set('Seleccione una asignación profesional activa.');
      return;
    }
    const guideline = new ClinicalGuideline(
      crypto.randomUUID(), assignment.psychologistId, assignment.childId,
      instructions.trim(), GuidelineStatus.DRAFT, new Date(), new Date(),
      title.trim(), assignment.id
    );
    if (!guideline.registrarPauta()) {
      this.formError.set('Ingrese un título y unas instrucciones válidas.');
      return;
    }
    this.guidelineCreated.emit(guideline);
    this.form.reset();
  }
}
