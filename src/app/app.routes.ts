
import { Routes } from '@angular/router';

// Shared
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

// BC03 - Care Network Management
const careNetwork = () =>
  import('./care-network-management/presentation/views/care-network-list')
    .then((m) => m.CareNetworkList);

const acceptInvitation = () =>
  import('./care-network-management/presentation/views/care-network-invitation-accept')
    .then((m) => m.CareNetworkInvitationAccept);

// BC04 - Routine & Activity Management
const routineActivityRoutes = () =>
  import('./routine-activity/routine-activity.routes')
    .then((m) => m.routineActivityRoutes);

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

  // BC03 - Care Network Management
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

  // BC04 - Routine & Activity Management
  {
    path: 'routine-activity',
    loadChildren: routineActivityRoutes,
    title: `${baseTitle} - Rutinas`
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
