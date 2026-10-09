import {Routes} from '@angular/router';

const routineList = () => import('./presentation/views/routine-list/routine-list').then(m => m.RoutineList);
const routineForm = () => import('./presentation/views/routine-form/routine-form').then(m => m.RoutineForm);
const routineExecution = () => import('./presentation/views/routine-execution/routine-execution').then(m => m.RoutineExecution);

/**
 * Route tree for Routine & Activity Management presentation views.
 */
export const routineActivityRoutes: Routes = [
  { path: 'routines',                loadComponent: routineList },
  { path: 'routines/new',            loadComponent: routineForm },
  { path: 'routines/:id/edit',       loadComponent: routineForm },
  { path: 'routines/:id/execution',  loadComponent: routineExecution },
  { path: '',                        redirectTo: 'routines', pathMatch: 'full' }
];
