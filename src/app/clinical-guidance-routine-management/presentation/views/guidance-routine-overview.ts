import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoutineActivityStore } from '../../application/routine-activity.store';
import { ClinicalGuidelineStore } from '../../application/clinical-guideline.store';
import { PatientAssignmentStore } from '../../application/patient-assignment.store';
import { AssignmentStatus } from '../../domain/model/assignment-status';
import { PracticalGuideStore } from '../../application/practical-guide.store';
import { GuidelineStatus } from '../../domain/model/guideline-status';

@Component({
  selector: 'app-guidance-routine-overview',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './guidance-routine-overview.html',
  styleUrl: './guidance-routine-overview.css'
})
export class GuidanceRoutineOverview implements OnInit {
  readonly routineStore = inject(RoutineActivityStore);
  readonly guidelineStore = inject(ClinicalGuidelineStore);
  readonly guideStore = inject(PracticalGuideStore);
  readonly assignmentStore = inject(PatientAssignmentStore);
  private readonly route = inject(ActivatedRoute);
  readonly childId = toSignal(this.route.queryParamMap.pipe(map(params => params.get('childId'))), {initialValue: null});

  readonly routines = computed(() => this.routineStore.routines()
    .filter(item => !this.childId() || item.childId === this.childId()));
  readonly clinicalGuidelines = computed(() => this.guidelineStore.guidelines()
    .filter(item => item.status === GuidelineStatus.ACTIVE && (!this.childId() || item.childId === this.childId())));
  readonly routinePreview = computed(() => this.routines().slice(0, 4));
  readonly guidelinesPreview = computed(() => this.clinicalGuidelines().slice(0, 3));
  readonly patientCount = computed(() => this.assignmentStore.assignments()
    .filter(item => item.status === AssignmentStatus.ACTIVE).length);
  readonly guideCount = computed(() => this.guideStore.totalGuides());

  ngOnInit(): void {
    this.guidelineStore.loadGuidelines();
    this.guideStore.loadGuides();
    this.assignmentStore.loadAssignments();
  }
}
