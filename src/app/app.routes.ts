
import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () =>
  import('./shared/presentation/views/about/about')
    .then((m) => m.About);

const clinicalGuidance = () =>
  import('./clinical-guidance/presentation/views/clinical-guideline-list/clinical-guideline-list')
    .then((m) => m.ClinicalGuidelineList);

const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found')
    .then((m) => m.PageNotFound);

const baseTitle = 'Kinemo';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
    title: `${baseTitle} - Home`
  },
  {
    path: 'clinical-guidance',
    loadComponent: clinicalGuidance,
    title: `${baseTitle} - Orientaciones Clínicas`
  },
  {
    path: 'about',
    loadComponent: about,
    title: `${baseTitle} - About`
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Page Not Found`
  }
];
