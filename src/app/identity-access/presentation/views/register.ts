
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap, map } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../infrastructure/services/auth.service';
import { UserRole } from '../../domain/model/user-role.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  firstName = '';
  lastName = '';
  phone = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: UserRole = UserRole.PARENT;

  readonly roles = [
    { value: UserRole.PARENT, label: 'Familiar' },
    { value: UserRole.CAREGIVER, label: 'Cuidador' },
    { value: UserRole.PSYCHOLOGIST, label: 'Psicólogo' }
  ];

  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  register(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {
      this.errorMessage.set('Completa todos los campos obligatorios');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.loading.set(true);

    this.authService.signUp({
      email: this.email.trim().toLowerCase(),
      password: this.password,
      role: this.role
    }).pipe(
      switchMap(user => {
        const profile = {
          id: crypto.randomUUID(),
          userId: user.id,
          firstName: this.firstName.trim(),
          lastName: this.lastName.trim(),
          phone: this.phone.trim(),
          updatedAt: new Date().toISOString()
        };

        return this.http.post(
          'http://localhost:3001/userProfiles',
          profile
        ).pipe(map(() => user));
      })
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Cuenta creada correctamente');
        this.router.navigate(['/login']);
      },
      error: error => {
        this.loading.set(false);
        this.errorMessage.set(
          error.message || 'No se pudo completar el registro'
        );
      }
    });
  }
}
