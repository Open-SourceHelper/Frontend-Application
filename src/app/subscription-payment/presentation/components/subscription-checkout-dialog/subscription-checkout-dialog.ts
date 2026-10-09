import {Component, effect, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {SubscriptionPaymentStore} from '../../../application/subscription-payment.store';
import {PaymentMethod} from '../../../domain/model/payment-method';

/**
 * Data received by the checkout dialog.
 */
export interface SubscriptionCheckoutData {
  planId: number;
}

/**
 * Pays the selected plan through a third-party gateway, in a dialog over the plan list (US38).
 *
 * @remarks
 * Kinemo never stores card data: the real integration delegates the card form to
 * Culqi Checkout / PayPal Buttons. The "simulación" field only exists to demo the
 * confirmation and rejection branches with json-server.
 * The dialog closes with true when the user wants to see the activated plan.
 */
@Component({
  selector: 'app-subscription-checkout-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatInput, MatIcon, MatProgressSpinner],
  templateUrl: './subscription-checkout-dialog.html',
  styleUrls: ['../../subscription-theme.css', './subscription-checkout-dialog.css']
})
export class SubscriptionCheckoutDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject<MatDialogRef<SubscriptionCheckoutDialog, boolean>>(MatDialogRef);
  private readonly data = inject<SubscriptionCheckoutData>(MAT_DIALOG_DATA);
  readonly store = inject(SubscriptionPaymentStore);

  protected readonly PaymentMethod = PaymentMethod;

  /**
   * Reactive selection of the selected plan.
   */
  readonly plan = this.store.getPlanById(this.data.planId);

  /**
   * Form-group for the payment form.
   */
  form = this.fb.group({
    paymentMethod: new FormControl<PaymentMethod>(PaymentMethod.CULQI, {nonNullable: true, validators: [Validators.required]}),
    cardholderName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    simulatedResult: new FormControl<'APPROVE' | 'REJECT'>('APPROVE', {nonNullable: true})
  });

  /**
   * Creates an instance of SubscriptionCheckoutDialog.
   */
  constructor() {
    // The dialog cannot be dismissed while the gateway is processing the payment.
    effect(() => this.dialogRef.disableClose = this.store.checkoutStatus() === 'PROCESSING');
  }

  /**
   * Submits the payment of the selected plan.
   */
  submit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.store.paySubscription(this.data.planId, value.paymentMethod, value.simulatedResult === 'APPROVE');
  }

  /**
   * Allows a new attempt after a rejected payment.
   */
  retry() {
    this.store.resetCheckout();
  }

  /**
   * Closes the dialog and opens the activated plan.
   */
  viewPlan() {
    this.dialogRef.close(true);
  }

  /**
   * Closes the dialog without opening the plan.
   */
  close() {
    this.dialogRef.close(false);
  }
}
