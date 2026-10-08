
import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { CareNetworkMember } from '../../domain/model/care-network-member.entity';
import { MemberStatus } from '../../domain/model/member-status';

@Component({
  selector: 'app-care-network-member-list',
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule
  ],
  templateUrl: './care-network-member-list.html',
  styleUrl: './care-network-member-list.css'
})
export class CareNetworkMemberList {

  readonly members = input.required<CareNetworkMember[]>();
  readonly loading = input(false);

  readonly memberRevoked = output<string>();

  readonly MemberStatus = MemberStatus;

  revokeMember(member: CareNetworkMember): void {
    if (this.loading() || member.status !== MemberStatus.ACTIVE) {
      return;
    }

    this.memberRevoked.emit(member.id);
  }
}
