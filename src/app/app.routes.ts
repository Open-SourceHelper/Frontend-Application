
import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () =>
  import('./shared/presentation/views/about/about')
    .then((m) => m.About);

const careNetwork = () =>
  import('./care-network-management/presentation/views/care-network-list')
    .then(m => m.CareNetworkList);

const acceptInvitation = () =>
  import('./care-network-management/presentation/views/care-network-invitation-accept')
    .then(m => m.CareNetworkInvitationAccept);

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
    path: 'care-networks/:careNetworkId',
    loadComponent: careNetwork,
    title: `${baseTitle} - Red de Cuidado`
  },
  {
    path: 'care-networks/invitations/accept/:invitationId',
    loadComponent: acceptInvitation,
    title: `${baseTitle} - Aceptar Invitación`
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
