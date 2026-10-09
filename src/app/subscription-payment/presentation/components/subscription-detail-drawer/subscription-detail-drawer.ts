import {Component, computed, HostListener, inject, input, output, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatError, MatFormFieldModule} from '@angular/material/form-field';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {SubscriptionPaymentStore} from '../../../application/subscription-payment.store';
import {SubscriptionStatus} from '../../../domain/model/subscription-status';
import {PaymentStatus} from '../../../domain/model/payment-status';
import {PaymentMethod} from '../../../domain/model/payment-method';

/**
 * Side panel with the current subscription, its payment history and the cancellation option (US38, US39).
 */
@Component({
  selector: 'app-subscription-detail-drawer',
  imports: [DatePipe, ReactiveFormsModule, MatError, MatFormFieldModule, MatInput, MatButton, MatIconButton, MatIcon],
  templateUrl: './subscription-detail-drawer.html',
  styleUrls: ['../../subscription-theme.css', './subscription-detail-drawer.css']
})
export class SubscriptionDetailDrawer {
  readonly store = inject(SubscriptionPaymentStore);

  protected readonly SubscriptionStatus = SubscriptionStatus;

  /**
   * Indicates if the panel is visible.
   */
  readonly opened = input<boolean>(false);

  /**
   * Emitted when the user closes the panel.
   */
  readonly closed = output<void>();

  /**
   * Emitted when the user wants to retry the payment of a pending subscription.
   */
  readonly retryPayment = output<number>();

  /**
   * Text shown for each subscription status.
   */
  protected readonly statusLabel: Record<string, string> = {
    [SubscriptionStatus.PENDING_PAYMENT]: 'Pago pendiente',
    [SubscriptionStatus.ACTIVE]: 'Activa',
    [SubscriptionStatus.CANCELLATION_SCHEDULED]: 'Cancelación programada',
    [SubscriptionStatus.CANCELLED]: 'Cancelada',
    [SubscriptionStatus.EXPIRED]: 'Vencida'
  };

  /**
   * Text shown for each payment status.
   */
  protected readonly paymentStatusLabel: Record<string, string> = {
    [PaymentStatus.PENDING]: 'Pendiente',
    [PaymentStatus.CONFIRMED]: 'Confirmado',
    [PaymentStatus.REJECTED]: 'Rechazado'
  };

  /**
   * Text shown for each payment method.
   */
  protected readonly paymentMethodLabel: Record<string, string> = {
    [PaymentMethod.CULQI]: 'Tarjeta (Culqi)',
    [PaymentMethod.PAYPAL]: 'PayPal'
  };

  /**
   * Subscription shown in the panel.
   */
  readonly subscription = this.store.currentSubscription;

  /**
   * Plan of the subscription shown in the panel.
   */
  readonly plan = computed(() => {
    const subscription = this.subscription();
    return subscription ? this.store.plans().find(plan => plan.id === subscription.planId) : undefined;
  });

  /**
   * Indicates if the cancellation confirmation is visible.
   */
  readonly confirmingCancellation = signal(false);

  /**
   * Optional reason of the cancellation.
   */
  readonly reason = new FormControl<string>('', {nonNullable: true});

  /** Closes the panel with the Escape key. */
  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.opened()) this.close();
  }

  /** Closes the panel. */
  close() {
    this.keepSubscription();
    this.closed.emit();
  }

  /** Shows the cancellation confirmation (US39). */
  askCancellation() {
    this.confirmingCancellation.set(true);
  }

  /** Hides the cancellation confirmation. */
  keepSubscription() {
    this.confirmingCancellation.set(false);
    this.reason.reset();
  }

  /** Schedules the cancellation at the end of the billing cycle (US39). */
  confirmCancellation(id: number) {
    this.store.cancelSubscription(id, this.reason.value);
    this.keepSubscription();
  }
}
