
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FooterContent } from '../footer-content/footer-content';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    FooterContent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  readonly collapsed = signal(false);

  readonly options = [
    // BC02 - Child Profile & Care Network Management
    { link: '/child-profile', label: 'Child Profile', icon: 'child_care' },
    { link: '/clinical-profile', label: 'Clinical Profile', icon: 'health_and_safety' },
    { link: '/care-networks/1', label: 'Red de Cuidado', icon: 'groups' },

    // BC03 - Crisis Alert Management
    { link: '/crisis-alerts', label: 'Alertas SOS', icon: 'notification_important' },

    // BC04 - Routine & Activity Management
    { link: '/routine-activity/routines', label: 'Rutinas', icon: 'event_note' },

    // Clinical Guidance Management (migrates to BC04)
    { link: '/clinical-guidance', label: 'Orientaciones Clínicas', icon: 'medical_services' },

    // BC05 - Observation & Crisis History Management
    { link: '/observations', label: 'Historial de episodios', icon: 'assignment' },

    // BC07 - Dashboard & Reporting
    { link: '/children/1/dashboard', label: 'Dashboard', icon: 'dashboard' },

    // BC08 - Subscription & Payment Management
    { link: '/subscription-payment/plans', label: 'Planes', icon: 'sell' },
  ];
  toggleMenu(): void {
    this.collapsed.update((value) => !value);
  }
}
