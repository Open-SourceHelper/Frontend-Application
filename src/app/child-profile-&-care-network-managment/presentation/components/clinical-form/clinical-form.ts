
import {Component, EventEmitter, inject, Output, OnInit, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DateTime} from '../../../../shared/domain/model/date-time';
import {ClinicalProfile} from '../../../domain/model/clinical-profile.entity';

import { Child } from '../../../domain/model/child.entity';
import { ChildService } from '../../../infrastructure/services/child.service';
import { ClinicalStore } from '../../../application/clinical.store';

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
export class ClinicalForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly childService = inject(ChildService);
  private readonly clinicalStore = inject(ClinicalStore);

  readonly children = signal<Child[]>([]);
  readonly childrenError = signal<string | null>(null);

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

    const existingNumbers = this.clinicalStore.profiles()
      .map(clinical => /^profile-(\d+)$/.exec(clinical.id))
      .filter((match): match is RegExpExecArray => match !== null)
      .map(match => Number(match[1]));

    const nextNumber = Math.max(0, ...existingNumbers) + 1;
    const clinicalId = `clinical-${String(nextNumber).padStart(3, '0')}`;

    const clinical = new ClinicalProfile(
      clinicalId,
      childId.trim(),
      specialNeeds.trim(),
      triggers.trim(),
      regulators.trim(),
      new DateTime(),
    );

    this.clinicalCreated.emit(clinical);
    this.form.reset();
  }

  ngOnInit(): void {
    this.childService.getAll().subscribe({
      next: children => this.children.set(children),
      error: () => this.childrenError.set('No se pudieron cargar los datos de los niños.'),
    });
  }
}
