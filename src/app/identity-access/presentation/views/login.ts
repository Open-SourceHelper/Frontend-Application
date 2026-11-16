
import { HttpErrorResponse } from '@angular/common/http';
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
import { environment } from '../../../../environments/environment';
import { LocalSpringApi, localAccounts } from '../../../shared/infrastructure/local-spring-api';
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

  private readonly springApi = inject(LocalSpringApi);
  readonly localBackend = !environment.production;
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

    if (environment.production) {
      const account = localAccounts.find(item => item.email === email.toLowerCase());
      if (!account) {
        this.loading.set(false);
        this.errorMessage.set('Correo o contraseña incorrectos.');
        return;
      }
      this.springApi.signInForEvaluation(account.id, this.password).subscribe({
        next: () => {
          this.password = '';
          this.loading.set(false);
          void this.router.navigate(['/observations']);
        },
        error: error => {
          this.loading.set(false);
          this.errorMessage.set(error instanceof HttpErrorResponse && error.status === 401
            ? 'Correo o contraseña incorrectos.'
            : 'No pudimos conectar con Kinemo. Intenta de nuevo.');
        }
      });
      return;
    }

    this.authService.signIn({ email, password: this.password }).subscribe({
      next: user => {
        this.authService.saveSession(user);
        this.authService.startSession(user);
        this.loading.set(false);
        this.openWorkspace();
      },
      error: error => {
        this.errorMessage.set(
          error.message || 'No se pudo iniciar sesión'
        );
        this.loading.set(false);
      }
    });
  }

  private openWorkspace(): void {
    const destination = this.route.snapshot.queryParamMap.get('returnUrl');
    if (destination?.startsWith('/') && !destination.startsWith('//')) {
      void this.router.navigateByUrl(destination);
    } else {
      void this.router.navigate(['/child-profile']);
    }
  }
}
