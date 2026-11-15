
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../../../identity-access/infrastructure/services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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
  readonly auth = inject(AuthService);
  readonly language = signal<'es' | 'en'>(localStorage.getItem('kinemo-navigation-language') === 'en' ? 'en' : 'es');
  readonly labels = {
    es: { modules: 'Módulos de Kinemo', menu: 'Menú de módulos', profile: 'Mi perfil', login: 'Iniciar sesión', language: 'Idioma de navegación' },
    en: { modules: 'Kinemo modules', menu: 'Module menu', profile: 'My profile', login: 'Sign in', language: 'Navigation language' },
  };
  readonly mobileOpen = signal(false);
  readonly narrow = toSignal(inject(BreakpointObserver).observe('(max-width: 760px)').pipe(
    map(result => result.matches),
  ), { initialValue: false });


  readonly options = [
    // BC02 - Child Profile & Care Network Management
    { link: '/child-profile', label: { es: 'Perfil infantil', en: 'Child profile' }, icon: 'child_care' },
    { link: '/clinical-profile', label: { es: 'Perfil clínico', en: 'Clinical profile' }, icon: 'health_and_safety' },
    { link: '/care-networks/1', label: { es: 'Red de cuidado', en: 'Care network' }, icon: 'groups' },

    // BC03 - Crisis Alert Management
    { link: '/crisis-alerts', label: { es: 'Alertas SOS', en: 'SOS alerts' }, icon: 'notification_important' },

    // BC04 - Clinical Guidance & Routine Management
    { link: '/clinical-guidance-routine-management', label: { es: 'Orientaciones y rutinas', en: 'Guidance and routines' }, icon: 'health_and_safety' },

    // BC05 - Observation & Crisis History Management
    { link: '/observations', label: { es: 'Historial de episodios', en: 'Episode history' }, icon: 'assignment' },

    // BC07 - Dashboard & Reporting
    { link: '/children/1/dashboard', label: { es: 'Panel de seguimiento', en: 'Progress dashboard' }, icon: 'dashboard' },

  ];
  setLanguage(language: 'es' | 'en'): void {
    this.language.set(language);
    localStorage.setItem('kinemo-navigation-language', language);
  }
}
