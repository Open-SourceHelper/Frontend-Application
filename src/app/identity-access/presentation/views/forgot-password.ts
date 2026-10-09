
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { switchMap, map, throwError } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface DemoUser {
  id: string;
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3001';

  email = '';
  newPassword = '';
  confirmPassword = '';

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  resetPassword(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.email.trim() || !this.newPassword || !this.confirmPassword) {
      this.errorMessage.set('Completa todos los campos');
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);

    const params = new HttpParams()
      .set('email', this.email.trim().toLowerCase());

    this.http.get<DemoUser[]>(`${this.apiUrl}/users`, { params }).pipe(
      switchMap(users => {
        const user = users[0];

        if (!user) {
          return throwError(() => new Error('No se encontró el correo'));
        }

        const recovery = {
          id: crypto.randomUUID(),
          userId: user.id,
          recoveryToken: crypto.randomUUID(),
          status: 'USED',
          expiresAt: new Date(Date.now() + 15 * 60000).toISOString(),
          createdAt: new Date().toISOString()
        };

        return this.http.post(`${this.apiUrl}/passwordRecoveries`, recovery).pipe(
          switchMap(() =>
            this.http.patch(
              `${this.apiUrl}/users/${user.id}`,
              { password: this.newPassword }
            )
          ),
          map(() => true)
        );
      })
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Contraseña de demostración actualizada');
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: error => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'No se pudo actualizar');
      }
    });
  }
}
