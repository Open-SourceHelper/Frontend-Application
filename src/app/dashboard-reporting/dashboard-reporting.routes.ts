import { Routes } from '@angular/router';

const dashboardOverview = () =>
  import('./presentation/views/dashboard-overview')
    .then((m) => m.DashboardOverview);

export const DASHBOARD_REPORTING_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: dashboardOverview,
    title: 'Kinemo - Dashboard y Reportes'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
];
