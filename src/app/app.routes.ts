import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);

const baseTitle = 'Kinemo';

export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home` },
  { path: 'about', loadComponent: about, title: `${baseTitle} - About` },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'login', loadComponent: () => import('./identity-access/presentation/views/login').then(m => m.Login)},
  {path: 'register', loadComponent: () => import('./identity-access/presentation/views/register').then(m => m.Register)},
  {path: 'profile', loadComponent: () => import('./identity-access/presentation/views/profile').then(m => m.Profile)},
  {path: 'forgot-password', loadComponent: () => import('./identity-access/presentation/views/forgot-password').then(m => m.ForgotPassword)},
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
