
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { CareNetworkInvitation } from '../../domain/model/care-network-invitation.entity';
import { CareNetworkInvitationResource } from '../resources/care-network-invitation.resource';
import { CareNetworkInvitationAssembler } from '../assemblers/care-network-invitation.assembler';

import { switchMap } from 'rxjs';
import { InvitationStatus } from '../../domain/model/invitation-status';
import { MemberStatus } from '../../domain/model/member-status';
import { CareRole } from '../../domain/model/care-role';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CareNetworkInvitationService {

  private readonly http = inject(HttpClient);

  private readonly endpointUrl =
    `${environment.platformProviderApiBaseUrl}/careNetworkInvitations`;

  getByCareNetworkId(
    careNetworkId: string
  ): Observable<CareNetworkInvitation[]> {

    const params = new HttpParams()
      .set('careNetworkId', careNetworkId);

    return this.http
      .get<CareNetworkInvitationResource[]>(
        this.endpointUrl,
        { params }
      )
      .pipe(
        map(resources =>
          CareNetworkInvitationAssembler.toEntitiesFromResponse(
            resources
          )
        )
      );
  }

  create(
    careNetworkId: string,
    inviteeEmail: string
  ): Observable<CareNetworkInvitation> {

    const createdAt = new Date();

    const expiresAt = new Date(createdAt);
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = {
      careNetworkId,
      inviteeEmail,
      status: InvitationStatus.PENDING,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      acceptedAt: null
    };

    return this.http
      .post<CareNetworkInvitationResource>(
        this.endpointUrl,
        invitation
      )
      .pipe(
        map(resource =>
          CareNetworkInvitationAssembler.toEntityFromResource(
            resource
          )
        )
      );
  }


  accept(
    invitationId: string
  ): Observable<CareNetworkInvitation> {

    const url = `${this.endpointUrl}/${encodeURIComponent(invitationId)}`;

    return this.http
      .get<CareNetworkInvitationResource>(url)
      .pipe(
        switchMap(invitation => {

          if (invitation.status !== InvitationStatus.PENDING) {
            throw new Error('La invitación no está pendiente.');
          }

          if (new Date() >= new Date(invitation.expiresAt)) {
            throw new Error('La invitación ha expirado.');
          }

          const newMember = {
            careNetworkId: invitation.careNetworkId,
            caregiverId: `test-${invitation.id}`,
            email: invitation.inviteeEmail,
            role: CareRole.CAREGIVER,
            status: MemberStatus.ACTIVE,
            permissions: {
              canReadChildProfile: true,
              canEditChildProfile: false
            },
            joinedAt: new Date().toISOString(),
            revokedAt: null
          };

          return this.http
            .post(
              `${environment.platformProviderApiBaseUrl}/careNetworkMembers`,
              newMember
            )
            .pipe(
              switchMap(() =>
                this.http.patch<CareNetworkInvitationResource>(
                  url,
                  {
                    status: InvitationStatus.ACCEPTED,
                    acceptedAt: new Date().toISOString()
                  }
                )
              ),
              map(updated =>
                CareNetworkInvitationAssembler.toEntityFromResource(
                  updated
                )
              )
            );
        })
      );
  }
}
