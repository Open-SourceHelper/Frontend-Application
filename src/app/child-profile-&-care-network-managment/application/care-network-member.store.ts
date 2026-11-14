
import { Injectable, inject, signal, computed } from '@angular/core';
import { finalize } from 'rxjs';

import { CareNetworkMember } from '../domain/model/care-network-member.entity';
import { MemberStatus } from '../domain/model/member-status';
import { CareNetworkMemberService } from '../infrastructure/services/care-network-member.service';

@Injectable({
  providedIn: 'root'
})
export class CareNetworkMemberStore {

  private readonly service = inject(CareNetworkMemberService);

  private readonly membersState =
    signal<CareNetworkMember[]>([]);

  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly members = this.membersState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly activeMembers = computed(() =>
    this.membersState().filter(
      member => member.status === MemberStatus.ACTIVE
    )
  );

  readonly totalActiveMembers = computed(
    () => this.activeMembers().length
  );

  loadMembers(careNetworkId: string): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.getByCareNetworkId(careNetworkId)
      .pipe(
        finalize(() => this.loadingState.set(false))
      )
      .subscribe({
        next: members => {
          this.membersState.set(members);
        },
        error: () => {
          this.errorState.set(
            'No se pudieron cargar los integrantes.'
          );
        }
      });
  }

  revokeMember(memberId: string): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.service.revoke(memberId)
      .pipe(
        finalize(() => this.loadingState.set(false))
      )
      .subscribe({
        next: updatedMember => {
          this.membersState.update(members =>
            members.map(member =>
              member.id === updatedMember.id
                ? updatedMember
                : member
            )
          );
        },
        error: () => {
          this.errorState.set(
            'No se pudo revocar el acceso del integrante.'
          );
        }
      });
  }
}
