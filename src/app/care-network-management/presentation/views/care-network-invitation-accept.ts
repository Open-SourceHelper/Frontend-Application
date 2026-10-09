
import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CareNetworkInvitationStore } from '../../application/care-network-invitation.store';

@Component({
  selector: 'app-care-network-invitation-accept',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './care-network-invitation-accept.html',
  styleUrl: './care-network-invitation-accept.css'
})
export class CareNetworkInvitationAccept {

  readonly invitationId = input.required<string>();

  readonly invitationStore = inject(
    CareNetworkInvitationStore
  );

  acceptInvitation(): void {
    if (
      !this.invitationId() ||
      this.invitationStore.loading()
    ) {
      return;
    }

    this.invitationStore.acceptInvitation(
      this.invitationId()
    );
  }
}
