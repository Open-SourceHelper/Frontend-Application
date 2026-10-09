
import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () =>
  import('./shared/presentation/views/about/about')
    .then((m) => m.About);

const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found')
    .then((m) => m.PageNotFound);

// BC02 - Child Profile Management
const child = () =>
  import('./child-profile/presentation/views/child-list/child-list')
    .then((m) => m.ChildList);

const clinical = () =>
  import('./child-profile/presentation/views/clinical-list/clinical-list')
    .then((m) => m.ClinicalList);

// BC05 - Clinical Guidance Management
const clinicalGuidance = () =>
  import('./clinical-guidance/presentation/views/clinical-guideline-list/clinical-guideline-list')
    .then((m) => m.ClinicalGuidelineList);

// BC06 - Observation & Crisis Management
const observationList = () =>
  import('./observation-crisis/presentation/pages/observation-list.component')
    .then((m) => m.ObservationListComponent);

const observationForm = () =>
  import('./observation-crisis/presentation/pages/observation-form.component')
    .then((m) => m.ObservationFormComponent);

const baseTitle = 'Kinemo';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/child-profile',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home,
    title: `${baseTitle} - Home`
  },
  {
    path: 'about',
    loadComponent: about,
    title: `${baseTitle} - About`
  },

  // BC01 - Identity & Access Management
  {
    path: 'login',
    loadComponent: () =>
      import('./identity-access/presentation/views/login')
        .then((m) => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./identity-access/presentation/views/register')
        .then((m) => m.Register)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./identity-access/presentation/views/profile')
        .then((m) => m.Profile)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./identity-access/presentation/views/forgot-password')
        .then((m) => m.ForgotPassword)
  },

  // BC02 - Child Profile Management
  {
    path: 'child-profile',
    loadComponent: child,
    title: `${baseTitle} - Child Profile`
  },
  {
    path: 'clinical-profile',
    loadComponent: clinical,
    title: `${baseTitle} - Clinical Profile`
  },

  // BC05 - Clinical Guidance Management
  {
    path: 'clinical-guidance',
    loadComponent: clinicalGuidance,
    title: `${baseTitle} - Orientaciones Clínicas`
  },

  // BC06 - Observation & Crisis Management
  {
    path: 'observations/new',
    loadComponent: observationForm,
    title: `${baseTitle} - Registrar observación`
  },
  {
    path: 'observations',
    loadComponent: observationList,
    title: `${baseTitle} - Observaciones y crisis`
  },

  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Page Not Found`
  }
];
