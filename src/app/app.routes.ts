
import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () =>
  import('./shared/presentation/views/about/about')
    .then((m) => m.About);

const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found')
    .then((m) => m.PageNotFound);

// Child Profile Management
const child = () =>
  import('./child-profile/presentation/views/child-list/child-list')
    .then((m) => m.ChildList);

const clinical = () =>
  import('./child-profile/presentation/views/clinical-list/clinical-list')
    .then((m) => m.ClinicalList);

// BC06 - Observation & Crisis Management
const observationList = () =>
  import('./observation-crisis/presentation/pages/observation-list.component')
    .then((m) => m.ObservationListComponent);

const observationForm = () =>
  import('./observation-crisis/presentation/pages/observation-form.component')
    .then((m) => m.ObservationFormComponent);

// BC04 - Routine & Activity Management
const routineActivityRoutes = () =>
  import('./routine-activity/routine-activity.routes')
    .then((m) => m.routineActivityRoutes);

// BC08 - Subscription & Payment Management
const subscriptionPaymentRoutes = () =>
  import('./subscription-payment/subscription-payment.routes')
    .then((m) => m.subscriptionPaymentRoutes);

const baseTitle = 'Kinemo';

/**
 * Root route configuration that composes bounded-context routes.
 */
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
    path: 'routine-activity',
    loadChildren: routineActivityRoutes,
    title: `${baseTitle} - Rutinas`
  },
  {
    path: 'subscription-payment',
    loadChildren: subscriptionPaymentRoutes,
    title: `${baseTitle} - Suscripción`
  },
  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Page Not Found`
  }
];
