
import {
  Component,
  inject,
  input,
  OnInit
} from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { CareNetworkMemberStore } from '../../application/care-network-member.store';
import { CareNetworkInvitationStore } from '../../application/care-network-invitation.store';

import { CareNetworkMemberList } from '../components/care-network-member-list';
import { CareNetworkInvitationForm } from '../components/care-network-invitation-form';

import { CareNetworkInvitationList } from '../components/care-network-invitation-list';

@Component({
  selector: 'app-care-network-list',
  standalone: true,
  imports: [
    CareNetworkMemberList,
    CareNetworkInvitationForm,
    CareNetworkInvitationList,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './care-network-list.html',
  styleUrl: './care-network-list.css'
})
export class CareNetworkList implements OnInit {

  readonly careNetworkId = input.required<string>();

  readonly memberStore = inject(CareNetworkMemberStore);
  readonly invitationStore = inject(CareNetworkInvitationStore);

  invitationError: string | null = null;

  ngOnInit(): void {
    this.memberStore.loadMembers(this.careNetworkId());

    this.invitationStore.loadInvitations(
      this.careNetworkId()
    );
  }


  onInviteCaregiver(email: string): void {

    const normalizedEmail = email.trim().toLowerCase();

    this.invitationError = null;

    const alreadyMember = this.memberStore.activeMembers()
      .some(member =>
        member.email.trim().toLowerCase() === normalizedEmail
      );

    if (alreadyMember) {
      this.invitationError =
        'Este cuidador ya pertenece a la red de cuidado.';
      return;
    }

    const pendingInvitation = this.invitationStore.invitations()
      .some(invitation =>
        invitation.inviteeEmail.trim().toLowerCase() === normalizedEmail &&
        invitation.status === 'PENDING' &&
        !invitation.isExpired()
      );

    if (pendingInvitation) {
      this.invitationError =
        'Este correo ya tiene una invitación pendiente.';
      return;
    }

    this.invitationStore.createInvitation(
      this.careNetworkId(),
      normalizedEmail
    );
  }


  onRevokeMember(memberId: string): void {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas revocar el acceso de este integrante?'
    );

    if (!confirmed) {
      return;
    }

    this.memberStore.revokeMember(memberId);
  }

}
