import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../identity-access/infrastructure/services/auth.service';
import { PublicSpringDemo } from '../shared/infrastructure/public-spring-demo';
import { LocalSpringApi } from '../shared/infrastructure/local-spring-api';

const springRoutes: Routes = [
  { path: '', pathMatch: 'full', data: { section: 'overview' } },
  { path: 'routines', data: { section: 'routines' } },
  { path: 'routines/new', data: { section: 'new' } },
  { path: 'routines/:id/execution', data: { section: 'routines' } },
  { path: 'routines/:id/edit', data: { section: 'edit' } },
  { path: 'guidelines', data: { section: 'guidelines' } },
  { path: 'guides', data: { section: 'guides' } },
  { path: 'patients', data: { section: 'patients' } },
];

for (const route of springRoutes) {
  route.canMatch = [() => {
    if (inject(LocalSpringApi).session) return true;
    if (!inject(AuthService).getCurrentUser()?.publicDemo) return false;
    return inject(PublicSpringDemo).base.pipe(map(Boolean));
  }];
  route.loadComponent = () => import('./presentation/views/spring-guidance-routine')
    .then(module => module.SpringGuidanceRoutine);
}

/** Lazy-loaded BC04 route tree, following care-network-management conventions. */
export const CLINICAL_GUIDANCE_ROUTINE_MANAGEMENT_ROUTES: Routes = [
  ...springRoutes,
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
