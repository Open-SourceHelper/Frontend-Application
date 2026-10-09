
import {
  Component,
  input,
  output,
  signal,
  effect,
  viewChild
} from '@angular/core';

import { FormsModule, NgForm} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-care-network-invitation-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './care-network-invitation-form.html',
  styleUrl: './care-network-invitation-form.css'
})
export class CareNetworkInvitationForm {

  readonly loading = input(false);
  readonly success = input(false);

  readonly invitationSubmitted = output<string>();

  readonly invitationForm = viewChild<NgForm>('invitationForm');


  readonly email = signal('');

  constructor() {
    effect(() => {
      if (this.success()) {
        this.invitationForm()?.resetForm({
          email: ''
        });

        this.email.set('');
      }
    });
  }



  sendInvitation(): void {
    const email = this.email().trim();

    if (!email || this.loading()) {
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return;
    }

    this.invitationSubmitted.emit(email);
  }
}
