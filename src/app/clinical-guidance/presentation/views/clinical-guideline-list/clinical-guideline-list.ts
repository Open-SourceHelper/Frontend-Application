import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { PracticalGuideList } from '../practical-guide-list/practical-guide-list';
import { ClinicalGuideline } from '../../../domain/model/clinical-guideline.entity';
import { GuidelineStatus } from '../../../domain/model/guideline-status';
import { ClinicalGuidelineStore } from '../../../application/clinical-guideline.store';
import { PatientAssignmentStore } from '../../../application/patient-assignment.store';
import { ClinicalGuidelineForm } from '../../components/clinical-guideline-form/clinical-guideline-form';

@Component({
  selector: 'app-clinical-guideline-list',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    ClinicalGuidelineForm,
    PracticalGuideList
  ],
  templateUrl: './clinical-guideline-list.html',
  styleUrl: './clinical-guideline-list.css'
})
export class ClinicalGuidelineList implements OnInit {
  readonly store = inject(ClinicalGuidelineStore);
  readonly assignmentStore = inject(PatientAssignmentStore);
  readonly editingGuideline = signal<ClinicalGuideline | null>(null);

  ngOnInit(): void {
    this.store.loadGuidelines();
    this.assignmentStore.loadAssignments();
  }

  onGuidelineCreated(guideline: ClinicalGuideline): void {
    if (this.store.loading()) {
      return;
    }
    this.store.createGuideline(guideline);
  }

  private copyGuideline(
    guideline: ClinicalGuideline
  ): ClinicalGuideline {
    return new ClinicalGuideline(
      guideline.id,
      guideline.psychologistId,
      guideline.childId,
      guideline.instructions,
      guideline.status,
      new Date(guideline.createdAt),
      new Date(guideline.updatedAt)
    );
  }

  startEditing(guideline: ClinicalGuideline): void {
    if (
      this.store.loading() ||
      guideline.status !== GuidelineStatus.DRAFT
    ) {
      return;
    }
    this.editingGuideline.set(guideline);
  }

  cancelEditing(): void {
    this.editingGuideline.set(null);
  }

  saveChanges(instructions: string): void {
    const guideline = this.editingGuideline();

    if (
      !guideline ||
      this.store.loading() ||
      guideline.status !== GuidelineStatus.DRAFT
    ) {
      return;
    }

    const updatedGuideline = this.copyGuideline(guideline);

    if (!updatedGuideline.actualizarPauta(instructions.trim())) {
      alert('Las instrucciones de la pauta no pueden estar vacías.');
      return;
    }

    this.store.updateGuideline(updatedGuideline);

    this.editingGuideline.set(null);
  }

  activateGuideline(guideline: ClinicalGuideline): void {

    if (this.store.loading()) {
      return;
    }

    if (guideline.status !== GuidelineStatus.DRAFT) {
      return;
    }

    if (!guideline.validarPauta()) {
      alert('La pauta clínica no contiene información válida.');
      return;
    }

    if (
      !this.assignmentStore.loaded() ||
      this.assignmentStore.loading() ||
      this.assignmentStore.error()
    ) {
      alert('No se pudieron verificar las asignaciones de pacientes.');
      return;
    }

    const hasAssignment = this.assignmentStore.hasActiveAssignment(
      guideline.psychologistId,
      guideline.childId
    );

    if (!hasAssignment) {
      alert(
        'No se puede activar la pauta: el psicólogo no tiene una asignación activa con este niño.'
      );
      return;
    }

    const updatedGuideline = this.copyGuideline(guideline);

    updatedGuideline.habilitarParaCuidadores();

    if (updatedGuideline.status === GuidelineStatus.ACTIVE) {
      this.store.updateGuideline(updatedGuideline);
    }
  }

  deactivateGuideline(guideline: ClinicalGuideline): void {

    if (this.store.loading()) {
      return;
    }

    if (guideline.status !== GuidelineStatus.ACTIVE) {
      return;
    }

    const updatedGuideline = this.copyGuideline(guideline);

    updatedGuideline.desactivarPauta();

    if (updatedGuideline.status === GuidelineStatus.INACTIVE) {
      this.store.updateGuideline(updatedGuideline);
    }
  }
}
