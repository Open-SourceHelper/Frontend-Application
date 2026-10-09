
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { CareNetworkMember } from '../../domain/model/care-network-member.entity';
import { MemberStatus } from '../../domain/model/member-status';
import { CareNetworkMemberResource } from '../resources/care-network-member.resource';
import { CareNetworkMemberAssembler } from '../assemblers/care-network-member.assembler';

@Injectable({
  providedIn: 'root'
})
export class CareNetworkMemberService {

  private readonly http = inject(HttpClient);

  private readonly endpointUrl =
    'http://localhost:3000/careNetworkMembers';

  getByCareNetworkId(
    careNetworkId: string
  ): Observable<CareNetworkMember[]> {

    const params = new HttpParams()
      .set('careNetworkId', careNetworkId);

    return this.http
      .get<CareNetworkMemberResource[]>(
        this.endpointUrl,
        { params }
      )
      .pipe(
        map(resources =>
          CareNetworkMemberAssembler.toEntitiesFromResponse(
            resources
          )
        )
      );
  }

  revoke(memberId: string): Observable<CareNetworkMember> {

    return this.http
      .patch<CareNetworkMemberResource>(
        `${this.endpointUrl}/${encodeURIComponent(memberId)}`,
        {
          status: MemberStatus.REVOKED,
          revokedAt: new Date().toISOString()
        }
      )
      .pipe(
        map(resource =>
          CareNetworkMemberAssembler.toEntityFromResource(
            resource
          )
        )
      );
  }
}
