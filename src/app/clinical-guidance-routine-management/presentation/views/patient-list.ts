import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientAssignmentStore } from '../../application/patient-assignment.store';
import { AssignmentStatus } from '../../domain/model/assignment-status';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [DatePipe, RouterLink, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css'
})
export class PatientList implements OnInit {
  readonly assignmentStore = inject(PatientAssignmentStore);
  readonly search = signal('');
  readonly activeAssignments = computed(() => this.assignmentStore.assignments()
    .filter(item => item.status === AssignmentStatus.ACTIVE &&
      (!this.search().trim() || item.childId.toLowerCase().includes(this.search().trim().toLowerCase()))));

  ngOnInit(): void { this.assignmentStore.loadAssignments(); }
  onSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); }
}
