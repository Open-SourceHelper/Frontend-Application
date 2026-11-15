import {
  Component,
  inject,
  input,
  signal,
  OnInit
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LocalSpringApi } from '../../../../shared/infrastructure/local-spring-api';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CareNetworkMemberStore } from '../../../application/care-network-member.store';
import { CareNetworkInvitationStore } from '../../../application/care-network-invitation.store';

import { CareNetworkMemberList } from '../care-network-member-list/care-network-member-list';
import { CareNetworkInvitationForm } from '../../components/care-network-invitation-form/care-network-invitation-form';

import { CareNetworkInvitationList} from '../care-network-invitation-list/care-network-invitation-list';

interface SpringNetwork {
  members: { id: number; caregiverId: number; status: string }[];
  invitations: { id: number; inviteeEmail: string; status: string }[];
}

@Component({
  selector: 'app-care-network-list',
  standalone: true,
  imports: [
    CareNetworkMemberList,
    CareNetworkInvitationForm,
    CareNetworkInvitationList,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './care-network-list.html',
  styleUrl: './care-network-list.css'
})
export class CareNetworkList implements OnInit {

  readonly careNetworkId = input.required<string>();

  readonly memberStore = inject(CareNetworkMemberStore);
  readonly invitationStore = inject(CareNetworkInvitationStore);

  invitationError: string | null = null;

  private readonly spring = inject(LocalSpringApi);
  readonly springSession = this.spring.session;
  readonly network = signal<SpringNetwork | null>(null);
  readonly busy = signal(false);
  readonly springError = signal('');
  readonly springMessage = signal('');

  private get childNetworkPath(): string {
    return '/children/' + encodeURIComponent(this.careNetworkId()) + '/care-network';
  }

  private async changeNetwork(action: () => Promise<SpringNetwork>, message = '') {
    if (this.busy()) return;
    this.busy.set(true);
    this.springError.set('');
    this.springMessage.set('');
    try {
      this.network.set(await action());
      this.springMessage.set(message);
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 403) {
        this.network.set(null);
        this.springError.set('Esta cuenta no puede administrar la red de cuidado.');
      } else {
        this.springError.set(error instanceof HttpErrorResponse && error.error?.detail
          ? error.error.detail : 'No se pudo actualizar la red de cuidado.');
      }
    } finally {
      this.busy.set(false);
    }
  }

  ngOnInit(): void {
    if (this.springSession) {
      void this.changeNetwork(() => firstValueFrom(this.spring.request<SpringNetwork>('GET', this.childNetworkPath)));
      return;
    }
    this.memberStore.loadMembers(this.careNetworkId());

    this.invitationStore.loadInvitations(
      this.careNetworkId()
    );
  }


  onInviteCaregiver(email: string): void {

    const normalizedEmail = email.trim().toLowerCase();
    if (this.springSession) {
      void this.changeNetwork(() => firstValueFrom(this.spring.request<SpringNetwork>(
        'POST', this.childNetworkPath + '/invitations', {
          email: normalizedEmail, permissions: ['canReadChildProfile'],
        },
      )), 'Invitación registrada.');
      return;
    }

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

    if (this.springSession) {
      void this.changeNetwork(async () => {
        await firstValueFrom(this.spring.request('DELETE', this.childNetworkPath + '/members/' + encodeURIComponent(memberId)));
        return firstValueFrom(this.spring.request<SpringNetwork>('GET', this.childNetworkPath));
      }, 'Acceso retirado.');
      return;
    }
    this.memberStore.revokeMember(memberId);
  }

}
