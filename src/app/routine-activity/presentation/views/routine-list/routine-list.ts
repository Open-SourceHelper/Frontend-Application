import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routine } from '../../../domain/model/routine.entity';
import { RoutineStore } from '../../../application/routine-store';
import { RoutineApiService } from '../../../infrastructure/services/routine-api.service';
import { RoutineAssembler } from '../../../infrastructure/assemblers/routine-assembler';

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './routine-list.html',
  styleUrl: './routine-list.css'
})
export class RoutineListComponent implements OnInit {

  routines: Routine[] = [];

  constructor(
    private readonly routineStore: RoutineStore,
    private readonly routineApiService: RoutineApiService,
    private readonly routineAssembler: RoutineAssembler,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoutines();
  }

  loadRoutines(): void {
    this.routineApiService.getAll().subscribe({
      next: response => {
        const routines = this.routineAssembler.toEntitiesFromResponse(response);

        this.routineStore.setRoutines(routines);
        this.routines = routines;

        this.changeDetectorRef.detectChanges();
      },
      error: error => {
        console.error('Error loading routines:', error);
      }
    });
  }
}
