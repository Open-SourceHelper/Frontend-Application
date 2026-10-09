
import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { CareNetworkInvitation } from '../../domain/model/care-network-invitation.entity';
import { InvitationStatus } from '../../domain/model/invitation-status';

@Component({
  selector: 'app-care-network-invitation-list',
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './care-network-invitation-list.html',
  styleUrl: './care-network-invitation-list.css'
})
export class CareNetworkInvitationList {

  readonly invitations =
    input.required<CareNetworkInvitation[]>();

  readonly InvitationStatus = InvitationStatus;

  getStatusLabel(
    status: InvitationStatus
  ): string {
    switch (status) {
      case InvitationStatus.PENDING:
        return 'Pendiente';

      case InvitationStatus.ACCEPTED:
        return 'Aceptada';

      case InvitationStatus.REJECTED:
        return 'Rechazada';

      case InvitationStatus.EXPIRED:
        return 'Expirada';

      default:
        return 'Desconocido';
    }
  }

  getEffectiveStatus(
    invitation: CareNetworkInvitation
  ): InvitationStatus {

    if (
      invitation.status === InvitationStatus.PENDING &&
      invitation.isExpired()
    ) {
      return InvitationStatus.EXPIRED;
    }

    return invitation.status;
  }

}
