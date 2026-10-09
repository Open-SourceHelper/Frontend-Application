import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

// Shared
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

// BC06 - Observation & Crisis Management
const observationList = () =>
  import('./observation-crisis/presentation/pages/observation-list.component')
    .then((m) => m.ObservationListComponent);

const observationForm = () =>
  import('./observation-crisis/presentation/pages/observation-form.component')
    .then((m) => m.ObservationFormComponent);

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
