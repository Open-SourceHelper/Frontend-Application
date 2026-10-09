import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../infrastructure/services/auth.service';

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

  private readonly apiUrl = 'http://localhost:3001/userProfiles';

  profile: UserProfileData | null = null;
  email = '';
  role = '';

  loading = signal(false);
  message = signal('');
  errorMessage = signal('');

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.email = user.email;
    this.role = user.role;

    this.http.get<UserProfileData[]>(
      `${this.apiUrl}?userId=${encodeURIComponent(user.id)}`
    ).subscribe({
      next: profiles => {
        this.profile = profiles[0] ?? null;

        if (!this.profile) {
          this.errorMessage.set('No se encontró el perfil del usuario');
        }
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el perfil');
      }
    });
  }

  saveProfile(): void {
    if (!this.profile) return;

    this.loading.set(true);
    this.message.set('');
    this.errorMessage.set('');

    const updatedProfile: UserProfileData = {
      ...this.profile,
      updatedAt: new Date().toISOString()
    };

    this.http.patch<UserProfileData>(
      `${this.apiUrl}/${this.profile.id}`,
      updatedProfile
    ).subscribe({
      next: profile => {
        this.profile = profile;
        this.loading.set(false);
        this.message.set('Perfil actualizado correctamente');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('No se pudo actualizar el perfil');
      }
    });
  }
}
