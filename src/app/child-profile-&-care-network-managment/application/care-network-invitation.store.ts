
import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize } from 'rxjs';

import { CareNetworkInvitation } from '../domain/model/care-network-invitation.entity';
import { CareNetworkInvitationService } from '../infrastructure/services/care-network-invitation.service';
import { InvitationStatus } from '../domain/model/invitation-status';

@Injectable({
  providedIn: 'root'
})
export class CareNetworkInvitationStore {

  private readonly service = inject(CareNetworkInvitationService);

  private readonly invitationsState =
    signal<CareNetworkInvitation[]>([]);

  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  private readonly successState = signal(false);

  private readonly invitationCreatedState = signal(false);

  readonly invitationCreated = this.invitationCreatedState.asReadonly();

  readonly success = this.successState.asReadonly();
  resetInvitationCreated(): void {this.invitationCreatedState.set(false);}

  readonly invitations = this.invitationsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly pendingInvitations = computed(() =>
    this.invitationsState().filter(
      invitation =>
        invitation.status === InvitationStatus.PENDING &&
        !invitation.isExpired()
    )
  );


  loadInvitations(careNetworkId: string): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.getByCareNetworkId(careNetworkId)
      .pipe(finalize(() => this.loadingState.set(false)))
      .subscribe({
        next: invitations => {
          this.invitationsState.set(invitations);
        },
        error: () => {
          this.errorState.set(
            'No se pudieron cargar las invitaciones.'
          );
        }
      });
  }


  createInvitation(
    careNetworkId: string,
    inviteeEmail: string
  ): void {

    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);
    this.invitationCreatedState.set(false);

    this.service.create(careNetworkId, inviteeEmail)
      .pipe(
        finalize(() => this.loadingState.set(false))
      )
      .subscribe({
        next: invitation => {
          this.invitationsState.update(items => [
            ...items,
            invitation
          ]);

          this.invitationCreatedState.set(true);
        },
        error: () => {
          this.errorState.set(
            'No se pudo enviar la invitación.'
          );
        }
      });
  }

  acceptInvitation(invitationId: string): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);
    this.successState.set(false);

    this.service.accept(invitationId)
      .pipe(
        finalize(() => this.loadingState.set(false))
      )
      .subscribe({
        next: updated => {
          this.invitationsState.update(items =>
            items.map(invitation =>
              invitation.id === updated.id
                ? updated
                : invitation
            )
          );

          this.successState.set(true);
        },
        error: () => {
          this.errorState.set(
            'No se pudo aceptar la invitación.'
          );
        }
      });
  }
}
