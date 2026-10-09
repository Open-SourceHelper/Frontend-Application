
import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () =>
  import('./shared/presentation/views/about/about')
    .then((m) => m.About);

const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found')
    .then((m) => m.PageNotFound);

const dashboardReporting = () =>
  import('./dashboard-reporting/dashboard-reporting.routes')
    .then((m) => m.DASHBOARD_REPORTING_ROUTES);

const baseTitle = 'Kinemo';

export const routes: Routes = [
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
    path: 'children/:childId',
    loadChildren: dashboardReporting,
    title: `${baseTitle} - Dashboard y Reportes`
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
