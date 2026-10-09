import {Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {MatError} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {SubscriptionPaymentStore} from '../../../application/subscription-payment.store';
import {PlanType} from '../../../domain/model/plan-type';
import {SubscriptionStatus} from '../../../domain/model/subscription-status';
import {
  SubscriptionCheckoutData, SubscriptionCheckoutDialog
} from '../../components/subscription-checkout-dialog/subscription-checkout-dialog';
import {SubscriptionDetailDrawer} from '../../components/subscription-detail-drawer/subscription-detail-drawer';

/**
 * Single screen of the bounded context: plan catalog (US37), checkout dialog (US38)
 * and "Mi plan" side panel with the payment history and the cancellation (US39).
 */
@Component({
  selector: 'app-plan-list',
  imports: [DatePipe, MatError, MatButton, MatProgressSpinner, MatIcon, MatTooltip, SubscriptionDetailDrawer],
  templateUrl: './plan-list.html',
  styleUrls: ['../../subscription-theme.css', './plan-list.css']
})
export class PlanList {
  readonly store = inject(SubscriptionPaymentStore);
  private dialog = inject(MatDialog);

  protected readonly PlanType = PlanType;

  /**
   * Text shown for each plan type.
   */
  protected readonly planTypeLabel: Record<string, string> = {
    [PlanType.FAMILY]: 'Para padres, tutores y cuidadores',
    [PlanType.PROFESSIONAL]: 'Para psicólogos y terapeutas'
  };

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
   * Indicates if the "Mi plan" side panel is open.
   */
  readonly drawerOpen = signal(false);

  /**
   * Subscription shown in the "Mi plan" column: only after subscribing
   * (premium access or a payment still pending), not for expired or cancelled ones.
   */
  readonly subscription = computed(() => {
    const subscription = this.store.currentSubscription();
    return subscription && (subscription.isPremium || subscription.isPendingPayment) ? subscription : undefined;
  });

  /**
   * Plan of the subscription shown in the "Mi plan" column.
   */
  readonly subscriptionPlan = computed(() => {
    const subscription = this.subscription();
    return subscription ? this.store.plans().find(plan => plan.id === subscription.planId) : undefined;
  });

  /**
   * Opens the checkout dialog over the plan list (US38).
   * @param planId - Selected plan.
   */
  selectPlan(planId: number) {
    this.store.resetCheckout();
    this.dialog.open<SubscriptionCheckoutDialog, SubscriptionCheckoutData, boolean>(SubscriptionCheckoutDialog, {
      data: {planId},
      width: '520px',
      maxWidth: '95vw',
      autoFocus: false
    }).afterClosed().subscribe(viewPlan => {
      this.store.resetCheckout();
      if (viewPlan) this.drawerOpen.set(true);
    });
  }

  /** Opens the "Mi plan" side panel. */
  openDrawer() {
    this.drawerOpen.set(true);
  }

  /** Closes the "Mi plan" side panel. */
  closeDrawer() {
    this.drawerOpen.set(false);
  }

  /** Retries the payment of a pending subscription from the side panel. */
  retryPayment(planId: number) {
    this.closeDrawer();
    this.selectPlan(planId);
  }
}
