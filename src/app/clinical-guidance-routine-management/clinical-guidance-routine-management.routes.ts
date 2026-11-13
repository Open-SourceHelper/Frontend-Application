import { Routes } from '@angular/router';

/** Lazy-loaded BC04 route tree, following care-network-management conventions. */
export const CLINICAL_GUIDANCE_ROUTINE_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/views/guidance-routine-overview')
      .then(m => m.GuidanceRoutineOverview)
  },
  {
    path: 'routines',
    loadComponent: () => import('./presentation/views/routine-list')
      .then(m => m.RoutineList)
  },
  {
    path: 'routines/new',
    loadComponent: () => import('./presentation/views/routine-form')
      .then(m => m.RoutineForm)
  },
  {
    path: 'routines/:id/edit',
    loadComponent: () => import('./presentation/views/routine-form')
      .then(m => m.RoutineForm)
  },
  {
    path: 'routines/:id/execution',
    loadComponent: () => import('./presentation/views/routine-execution')
      .then(m => m.RoutineExecution)
  },
  {
    path: 'guidelines',
    loadComponent: () => import('./presentation/views/clinical-guideline-list')
      .then(m => m.ClinicalGuidelineList)
  },
  {
    path: 'patients',
    loadComponent: () => import('./presentation/views/patient-list')
      .then(m => m.PatientList)
  },
  {
    path: 'guides',
    loadComponent: () => import('./presentation/views/practical-guide-list')
      .then(m => m.PracticalGuideList)
  }
];
