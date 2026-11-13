import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { PatientAssignment } from '../domain/model/patient-assignment.entity';
import { PatientAssignmentService } from '../infrastructure/services/patient-assignment.service';

@Injectable({
  providedIn: 'root'
})
export class PatientAssignmentStore {

  private readonly service = inject(PatientAssignmentService);

  private readonly assignmentsState = signal<PatientAssignment[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly loadedState = signal(false);

  readonly assignments = this.assignmentsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly loaded = this.loadedState.asReadonly();

  readonly totalAssignments = computed(
    () => this.assignmentsState().length
  );

  loadAssignments(): void {
    this.loadingState.set(true);
    this.errorState.set(null);
    this.loadedState.set(false);

    this.service.getAll()
      .pipe(
        finalize(() => this.loadingState.set(false))
      )
      .subscribe({
        next: assignments => {
          this.assignmentsState.set(assignments);
          this.loadedState.set(true);
        },
        error: () => {
          this.errorState.set(
            'No se pudieron cargar las asignaciones de pacientes.'
          );
        }
      });
  }

  createAssignment(assignment: PatientAssignment): void {
    if (this.loadingState()) {
      return;
    }

    if (!assignment.asignarPaciente()) {
      this.errorState.set(
        'El psicólogo y el niño deben tener identificadores válidos.'
      );
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.create(assignment)
      .pipe(
        finalize(() => this.loadingState.set(false))
      )
      .subscribe({
        next: createdAssignment => {
          this.assignmentsState.update(assignments => [
            ...assignments,
            createdAssignment
          ]);
        },
        error: () => {
          this.errorState.set(
            'No se pudo registrar la asignación del paciente.'
          );
        }
      });
  }

  hasActiveAssignment(
    psychologistId: string,
    childId: string
  ): boolean {
    if (!this.loadedState()) {
      return false;
    }

    return this.assignmentsState().some(assignment =>
      assignment.psychologistId === psychologistId &&
      assignment.childId === childId &&
      assignment.verificarAsignacion()
    );
  }
}
