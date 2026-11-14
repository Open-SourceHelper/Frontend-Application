
import { Routes } from '@angular/router';

export const CHILD_PROFILE_CARE_NETWORK_ROUTES: Routes = [
  {
    path: ':careNetworkId',
    loadComponent: () =>
      import('./presentation/views/care-network-list/care-network-list')
        .then(m => m.CareNetworkList)
  },
  {
    path: 'invitations/accept/:invitationId',
    loadComponent: () =>
      import('./presentation/views/care-network-invitation-accept/care-network-invitation-accept')
        .then(m => m.CareNetworkInvitationAccept)
  }
];
