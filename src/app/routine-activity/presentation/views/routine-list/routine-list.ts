import {Component, computed, inject, viewChild} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs';
import {MatError} from '@angular/material/form-field';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTooltip} from '@angular/material/tooltip';
import {RoutineActivityStore} from '../../../application/routine-activity.store';
import {RoutineStatus} from '../../../domain/model/routine-status';

/**
 * Displays the routine collection with its actions (US13, US15, US28, US29).
 */
@Component({
  selector: 'app-routine-list',
  imports: [
    MatError, MatTable, MatHeaderCellDef, MatCellDef, MatColumnDef, MatHeaderCell, MatCell,
    MatHeaderRowDef, MatRowDef, MatHeaderRow, MatRow, MatButton, MatIconButton,
    MatProgressSpinner, MatIcon, MatSort, MatSortHeader, MatPaginator, MatTooltip
  ],
  templateUrl: './routine-list.html',
  styleUrls: ['../../routine-theme.css', './routine-list.css']
})
export class RoutineList {
  readonly store = inject(RoutineActivityStore);
  protected router = inject(Router);
  private route = inject(ActivatedRoute);

  protected readonly RoutineStatus = RoutineStatus;

  /**
   * Text shown for each routine status.
   */
  protected readonly statusLabel: Record<string, string> = {
    [RoutineStatus.ACTIVE]: 'Activa',
    [RoutineStatus.DRAFT]: 'Borrador',
    [RoutineStatus.INACTIVE]: 'Inactiva'
  };

  /**
   * Child selected from Child Profile Management (?childId=...), or null to show every routine.
   */
  readonly childId = toSignal(this.route.queryParamMap.pipe(map(params => params.get('childId'))), {initialValue: null});

  /**
   * Routines of the selected child.
   */
  readonly routines = this.store.getRoutinesByChildId(this.childId);

  /**
   * Columns to display in the table.
   */
  displayedColumns: string[] = ['name', 'childId', 'status', 'activities', 'totalMinutes', 'actions'];

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  /**
   * Computed data source for the table.
   */
  readonly dataSource = computed(() => {
    const source = new MatTableDataSource(this.routines());
    source.sortingDataAccessor = (routine, column) => {
      switch (column) {
        case 'activities': return routine.activities.length;
        case 'totalMinutes': return routine.totalMinutes;
        default: return (routine as unknown as Record<string, string>)[column];
      }
    };
    const sort = this.sort();
    if (sort) source.sort = sort;
    const paginator = this.paginator();
    if (paginator) source.paginator = paginator;
    return source;
  });

  /** Opens the execution view of a routine (US13). */
  executeRoutine(id: number) {
    this.router.navigate(['routine-activity/routines', id, 'execution']).then();
  }

  /** Navigates to the edit page of a routine. */
  editRoutine(id: number) {
    this.router.navigate(['routine-activity/routines', id, 'edit']).then();
  }

  /** Duplicates a routine as a draft (US28). */
  duplicateRoutine(id: number) {
    this.store.duplicateRoutine(id);
  }

  /** Activates a routine. */
  activateRoutine(id: number) {
    this.store.activateRoutine(id);
  }

  /** Inactivates a routine. */
  deactivateRoutine(id: number) {
    this.store.deactivateRoutine(id);
  }

  /** Deletes an inactive routine (US29). */
  deleteRoutine(id: number) {
    this.store.deleteRoutine(id);
  }

  /** Removes the child filter. */
  clearChildFilter() {
    this.router.navigate(['routine-activity/routines']).then();
  }

  /** Navigates to the new routine form, keeping the selected child. */
  navigateToNew() {
    const childId = this.childId();
    this.router.navigate(['routine-activity/routines/new'], {queryParams: childId ? {childId} : {}}).then();
  }
}
