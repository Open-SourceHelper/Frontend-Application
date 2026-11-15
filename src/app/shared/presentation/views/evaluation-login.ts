import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LocalSpringApi, localAccounts } from '../../infrastructure/local-spring-api';

@Component({
  imports: [FormsModule, RouterLink],
  template: `
    <main>
      <a routerLink="/login">← Kinemo</a>
      <h1>Evaluación de Kinemo</h1>
      <p>Usa una de las cuentas de evaluación. Los registros que guardes se comparten con el equipo de prueba.</p>
      <form #credentials="ngForm" (ngSubmit)="signIn()">
        <label>Cuenta
          <select name="account" [(ngModel)]="account" required>
            <option value="">Selecciona tu rol</option>
            @for (item of accounts; track item.id) {
              <option [value]="item.id">{{ item.name }} · {{ item.id }}</option>
            }
          </select>
        </label>
        <label>Contraseña
          <input name="password" type="password" autocomplete="current-password" [(ngModel)]="password" required>
        </label>
        <button [disabled]="pending() || credentials.invalid">{{ pending() ? 'Conectando…' : 'Entrar' }}</button>
      </form>
      @if (error()) { <p role="alert">{{ error() }}</p> }
    </main>
  `,
  styles: `
    main{max-width:32rem;margin:4rem auto;padding:0 1.25rem;color:#261639}
    a{color:#512681} form,label{display:grid;gap:.55rem} form{gap:1rem}
    input,select,button{min-height:2.75rem;padding:.5rem .75rem;font:inherit;border:1px solid #80669b;border-radius:.5rem}
    button{color:white;background:#512681} button:disabled{opacity:.6}
    [role=alert]{color:#9a2026}
  `,
})
export class EvaluationLogin {
  private readonly api = inject(LocalSpringApi);
  private readonly router = inject(Router);
  readonly accounts = localAccounts;
  readonly pending = signal(false);
  readonly error = signal('');
  account = '';
  password = '';

  async signIn(): Promise<void> {
    if (this.pending() || !this.account || !this.password) return;
    this.pending.set(true);
    this.error.set('');
    try {
      await firstValueFrom(this.api.signInForEvaluation(this.account, this.password));
      this.password = '';
      await this.router.navigate(['/observations']);
    } catch (error) {
      this.error.set(error instanceof HttpErrorResponse && error.status === 401
        ? 'La contraseña no corresponde a esa cuenta.'
        : 'No se pudo abrir la evaluación. Comprueba que la API esté disponible.');
    } finally {
      this.pending.set(false);
    }
  }
}
