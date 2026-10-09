
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
    { link: '/home', label: 'Home', icon: 'home' },
    { link: '/about', label: 'About', icon: 'info' },

    // BC02 - Child Profile Management
    { link: '/child-profile', label: 'Child Profile', icon: 'child_care' },
    { link: '/clinical-profile', label: 'Clinical Profile', icon: 'health_and_safety' },

    // BC03 - Care Network Management
    { link: '/care-networks/1', label: 'Red de Cuidado', icon: 'groups' },

    // BC04 - Routine & Activity Management
    { link: '/routine-activity/routines', label: 'Rutinas', icon: 'event_note' },

    // BC05 - Clinical Guidance Management
    { link: '/clinical-guidance', label: 'Orientaciones Clínicas', icon: 'medical_services' },

    // BC06 - Observation & Crisis Management
    { link: '/observations', label: 'Observaciones y crisis', icon: 'assignment' },

    // BC07 - Dashboard & Reporting
    { link: '/children/1/dashboard', label: 'Dashboard', icon: 'dashboard' },

    // BC08 - Subscription & Payment Management
    { link: '/subscription-payment/plans', label: 'Planes', icon: 'sell' },
  ];

  toggleMenu(): void {
    this.collapsed.update((value) => !value);
  }
}
