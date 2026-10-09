import {Routes} from '@angular/router';

const planList = () => import('./presentation/views/plan-list/plan-list').then(m => m.PlanList);

/**
 * Route tree for Subscription & Payment Management presentation views.
 *
 * @remarks
 * Checkout (dialog) and subscription detail (side panel) are opened from the plan list.
 */
export const subscriptionPaymentRoutes: Routes = [
  { path: 'plans', loadComponent: planList },
  { path: '',      redirectTo: 'plans', pathMatch: 'full' }
];
