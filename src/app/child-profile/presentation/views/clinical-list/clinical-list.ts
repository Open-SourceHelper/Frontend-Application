import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ClinicalProfile } from '../../../domain/model/clinical-profile.entity';
import { ClinicalStore } from '../../../application/clinical.store';
import { ClinicalForm } from '../../components/clinical-form/clinical-form';
import { DateTime } from '../../../../shared/domain/model/date-time';

@Component({
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ClinicalForm,
  ],
  selector: 'app-clinical-list',
  styleUrl: './clinical-list.css',
  templateUrl: './clinical-list.html',
})
export class ClinicalList implements OnInit {
  readonly store = inject(ClinicalStore);
  readonly editingProfile = signal<ClinicalProfile | null>(null);

  ngOnInit(): void {
    this.store.loadProfiles();
  }

  onClinicalCreated(profile: ClinicalProfile): void {
    if (this.store.loading()) {
      return;
    }

    this.store.createProfile(profile);
  }

  private copyProfile(profile: ClinicalProfile): ClinicalProfile {
    return new ClinicalProfile(
      profile.id,
      profile.childId,
      profile.specialNeeds,
      profile.triggers,
      profile.regulators,
      new DateTime(profile.updatedAt.toString()),
      profile.child,
    );
  }

  startEditing(profile: ClinicalProfile): void {
    if (this.store.loading()) {
      return;
    }

    this.editingProfile.set(this.copyProfile(profile));
  }

  cancelEditing(): void {
    this.editingProfile.set(null);
  }

  saveChanges(
    specialNeeds: string,
    triggers: string,
    regulators: string,
  ): void {
    const profile = this.editingProfile();

    if (!profile || this.store.loading()) {
      return;
    }

    const trimmedSpecialNeeds = specialNeeds.trim();
    const trimmedTriggers = triggers.trim();
    const trimmedRegulators = regulators.trim();

    if (!trimmedSpecialNeeds || !trimmedTriggers || !trimmedRegulators) {
      alert('Complete las necesidades especiales, los desencadenantes y los reguladores.');
      return;
    }

    const updatedProfile = new ClinicalProfile(
      profile.id,
      profile.childId,
      trimmedSpecialNeeds,
      trimmedTriggers,
      trimmedRegulators,
      new DateTime(),
      profile.child,
    );

    this.store.updateProfile(updatedProfile);
    this.editingProfile.set(null);
  }
}
