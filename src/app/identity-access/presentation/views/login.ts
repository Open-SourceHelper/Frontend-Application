
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';

  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  login(): void {
    if (this.loading()) return;
    const email = this.email.trim();
    if (!email || !this.password) {
      this.errorMessage.set('Completa todos los campos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+$/.test(email)) {
      this.errorMessage.set('Ingresa un correo válido.');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.signIn({ email, password: this.password }).subscribe({
      next: user => {
        this.authService.saveSession(user);
        this.authService.startSession(user);
        this.loading.set(false);
        const destination = this.route.snapshot.queryParamMap.get('returnUrl');
        if (destination?.startsWith('/') && !destination.startsWith('//')) {
          void this.router.navigateByUrl(destination);
        } else {
          void this.router.navigate(['/child-profile']);
        }
      },
      error: error => {
        this.errorMessage.set(
          error.message || 'No se pudo iniciar sesión'
        );
        this.loading.set(false);
      }
    });
  }
}

