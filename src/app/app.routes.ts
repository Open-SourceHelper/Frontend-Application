
import { Routes } from '@angular/router';

// Shared
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found')
    .then((m) => m.PageNotFound);

// BC02 - Child Profile & Care Network Management
const child = () =>
  import('./child-profile-&-care-network-managment/presentation/views/child-list/child-list')
    .then((m) => m.ChildList);

const clinical = () =>
  import('./child-profile-&-care-network-managment/presentation/views/clinical-list/clinical-list')
    .then((m) => m.ClinicalList);

const careNetwork = () =>
  import('./child-profile-&-care-network-managment/presentation/views/care-network-list/care-network-list')
    .then((m) => m.CareNetworkList);

const acceptInvitation = () =>
  import('./child-profile-&-care-network-managment/presentation/views/care-network-invitation-accept/care-network-invitation-accept')
    .then((m) => m.CareNetworkInvitationAccept);

// New BC03 - Crisis Alert Management
const crisisAlerts = () =>
  import('./crisis-alert/presentation/views/crisis-alert-list')
    .then((m) => m.CrisisAlertList);

// BC04 - Routine & Activity Management
const routineActivityRoutes = () =>
  import('./routine-activity/routine-activity.routes')
    .then((m) => m.routineActivityRoutes);

// Clinical Guidance Management (migrates to BC04)
const clinicalGuidance = () =>
  import('./clinical-guidance/presentation/views/clinical-guideline-list/clinical-guideline-list')
    .then((m) => m.ClinicalGuidelineList);

// BC05 - Observation & Crisis History Management
const episodeHistory = () =>
  import('./observation-crisis-history/presentation/pages/episode-history')
    .then((m) => m.EpisodeHistory);

// BC07 - Dashboard & Reporting
const dashboardReporting = () =>
  import('./dashboard-reporting/dashboard-reporting.routes')
    .then((m) => m.DASHBOARD_REPORTING_ROUTES);

// BC08 - Subscription & Payment Management
const subscriptionPaymentRoutes = () =>
  import('./subscription-payment/subscription-payment.routes')
    .then((m) => m.subscriptionPaymentRoutes);

const baseTitle = 'Kinemo';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/child-profile',
    pathMatch: 'full'
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

  // BC02 - Child Profile & Care Network Management
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
    path: 'care-networks/invitations/accept/:invitationId',
    loadComponent: acceptInvitation,
    title: `${baseTitle} - Aceptar Invitación`
  },
  {
    path: 'care-networks/:careNetworkId',
    loadComponent: careNetwork,
    title: `${baseTitle} - Red de Cuidado`
  },

  // New BC03 - Crisis Alert Management
  {
    path: 'crisis-alerts',
    loadComponent: crisisAlerts,
    title: `${baseTitle} - Alertas de crisis`
  },

  // BC04 - Routine & Activity Management
  {
    path: 'routine-activity',
    loadChildren: routineActivityRoutes,
    title: `${baseTitle} - Rutinas`
  },

  // Clinical Guidance Management (migrates to BC04)
  {
    path: 'clinical-guidance',
    loadComponent: clinicalGuidance,
    title: `${baseTitle} - Orientaciones Clínicas`
  },

  // BC05 - Observation & Crisis History Management
  {
    path: 'observations/new',
    loadComponent: episodeHistory,
    title: `${baseTitle} - Registrar observación`
  },
  {
    path: 'observations',
    loadComponent: episodeHistory,
    title: `${baseTitle} - Historial de episodios`
  },

  // BC07 - Dashboard & Reporting
  {
    path: 'children/:childId',
    loadChildren: dashboardReporting,
    title: `${baseTitle} - Dashboard y Reportes`
  },

  // BC08 - Subscription & Payment Management
  {
    path: 'subscription-payment',
    loadChildren: subscriptionPaymentRoutes,
    title: `${baseTitle} - Suscripción`
  },

  // Page Not Found
  {
    path: '**',
    loadComponent: pageNotFound,
    title: `${baseTitle} - Page Not Found`
  }
];
