import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../infrastructure/services/auth.service';
import type { SubscriptionResource } from '../../../subscription-payment/infrastructure/subscriptions-response';
import type { SubscriptionPlanResource } from '../../../subscription-payment/infrastructure/subscription-plans-response';
import { switchMap, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface UserProfileData {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  updatedAt: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.platformProviderApiBaseUrl}/userProfiles`;

  readonly profile = signal<UserProfileData | null>(null);
  email = '';
  role = '';

  loading = signal(false);
  planName = signal('Consultando plan…');
  private hasProfile = false;
  message = signal('');
  errorMessage = signal('');

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.email = user.email;
    this.role = {
      PARENT: 'Padre, madre o tutor',
      CAREGIVER: 'Cuidador',
      PSYCHOLOGIST: 'Profesional de psicología',
    }[user.role];
    const base = environment.platformProviderApiBaseUrl;
    this.http.get<SubscriptionResource[]>(base + environment.platformProviderSubscriptionsEndpointPath, {
      params: { userId: user.id, status: 'ACTIVE' },
    }).pipe(switchMap(subscriptions => {
      const active = subscriptions[0];
      return active ? this.http.get<SubscriptionPlanResource>(
        base + environment.platformProviderSubscriptionPlansEndpointPath + '/' + encodeURIComponent(active.planId)
      ) : of(null);
    })).subscribe({
      next: plan => this.planName.set(plan?.name ?? 'Sin plan activo'),
      error: () => this.planName.set('No se pudo consultar el plan'),
    });

    this.http.get<UserProfileData[]>(this.apiUrl, { params: { userId: user.id } }).subscribe({
      next: profiles => {
        this.hasProfile = profiles.length > 0;
        this.profile.set(profiles[0] ?? {
          id: crypto.randomUUID(), userId: user.id, firstName: '', lastName: '', phone: '', updatedAt: '',
        });
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el perfil');
      }
    });
  }

  saveProfile(): void {
    const profile = this.profile();
    if (!profile || this.loading() || !profile.firstName.trim() || !profile.lastName.trim()) return;

    this.loading.set(true);
    this.message.set('');
    this.errorMessage.set('');

    const updatedProfile: UserProfileData = {
      ...profile,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      updatedAt: new Date().toISOString()
    };

    const request = this.hasProfile
      ? this.http.patch<UserProfileData>(this.apiUrl + '/' + encodeURIComponent(updatedProfile.id), updatedProfile)
      : this.http.post<UserProfileData>(this.apiUrl, updatedProfile);
    request.subscribe({
      next: profile => {
        this.hasProfile = true;
        this.profile.set(profile);
        this.loading.set(false);
        this.message.set('Perfil actualizado correctamente');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('No se pudo actualizar el perfil');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

