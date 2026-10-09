
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
    { link: '/child-profile', label: 'Child Profile', icon: 'child_care' },
    { link: '/clinical-profile', label: 'Clinical Profile', icon: 'health_and_safety' },
    {
      link: '/observations',
      label: 'Observaciones y crisis',
      icon: 'assignment',
    },
    { link: '/routine-activity/routines', label: 'Rutinas', icon: 'event_note' },
    { link: '/subscription-payment/plans', label: 'Planes', icon: 'sell' },
  ];
  toggleMenu(): void {
    this.collapsed.update((value) => !value);
  }
}
