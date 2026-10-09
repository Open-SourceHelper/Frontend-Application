import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const child = () =>
  import('./child-profile/presentation/views/child-list/child-list').then((m) => m.ChildList);
const clinical = () =>
  import('./child-profile/presentation/views/clinical-list/clinical-list').then((m) => m.ClinicalList);
const routineActivityRoutes = () =>
  import('./routine-activity/routine-activity.routes').then((m) => m.routineActivityRoutes);
const subscriptionPaymentRoutes = () =>
  import('./subscription-payment/subscription-payment.routes').then((m) => m.subscriptionPaymentRoutes);
const baseTitle = 'Kinemo';

/**
 * Root route configuration that composes bounded-context routes.
 */
export const routes: Routes = [
  //{ path: 'home', component: Home, title: `${baseTitle} - Home` },
  //{ path: 'about', loadComponent: about, title: `${baseTitle} - About` },
  { path: '', redirectTo: '/child-profile', pathMatch: 'full' },
  { path: 'child-profile', loadComponent: child, title: `${baseTitle} - Child Profile` },
  { path: 'clinical-profile', loadComponent: clinical, title: `${baseTitle} - Clinical Profile` },
  { path: 'routine-activity', loadChildren: routineActivityRoutes, title: `${baseTitle} - Rutinas` },
  { path: 'subscription-payment', loadChildren: subscriptionPaymentRoutes, title: `${baseTitle} - Suscripción` },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
