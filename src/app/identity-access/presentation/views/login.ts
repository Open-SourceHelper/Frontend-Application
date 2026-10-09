
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../infrastructure/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Completa todos los campos');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.signIn({
      email: this.email,
      password: this.password
    }).subscribe({
      next: user => {
        this.authService.saveSession(user);
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: error => {
        this.errorMessage.set(
          error.message || 'Error al iniciar sesión'
        );
        this.loading.set(false);
      }
    });
  }
}
