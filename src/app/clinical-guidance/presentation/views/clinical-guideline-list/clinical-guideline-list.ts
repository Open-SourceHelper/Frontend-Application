
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { ClinicalGuideline } from '../../../domain/model/clinical-guideline.entity';
import { GuidelineStatus } from '../../../domain/model/guideline-status';
import { ClinicalGuidelineStore } from '../../../application/clinical-guideline.store';
import { ClinicalGuidelineForm } from '../../components/clinical-guideline-form/clinical-guideline-form';

@Component({
  selector: 'app-clinical-guideline-list',
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    ClinicalGuidelineForm
  ],
  templateUrl: './clinical-guideline-list.html',
  styleUrl: './clinical-guideline-list.css'
})
export class ClinicalGuidelineList implements OnInit {
  readonly store = inject(ClinicalGuidelineStore);

  readonly editingGuideline = signal<ClinicalGuideline | null>(null);

  ngOnInit(): void {
    this.store.loadGuidelines();
  }

  onGuidelineCreated(guideline: ClinicalGuideline): void {
    this.store.createGuideline(guideline);
  }

  startEditing(guideline: ClinicalGuideline): void {
    if (guideline.status !== GuidelineStatus.DRAFT) {
      return;
    }

    this.editingGuideline.set(guideline);
  }

  cancelEditing(): void {
    this.editingGuideline.set(null);
  }

  saveChanges(instructions: string): void {
    const guideline = this.editingGuideline();

    if (!guideline || guideline.status !== GuidelineStatus.DRAFT) {
      return;
    }

    if (guideline.actualizarPauta(instructions.trim())) {
      this.store.updateGuideline(guideline);
      this.editingGuideline.set(null);
    }
  }
}
