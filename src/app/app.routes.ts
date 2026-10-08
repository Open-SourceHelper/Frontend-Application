import { Routes } from '@angular/router';
import { Home } from './shared/presentation/views/home/home';

const about = () => import('./shared/presentation/views/about/about').then((m) => m.About);
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);
const child = () =>
  import('./child-profile/presentation/views/child-list/child-list').then((m) => m.ChildList);

const baseTitle = 'Kinemo';

export const routes: Routes = [
  { path: 'home', component: Home, title: `${baseTitle} - Home` },
  { path: 'about', loadComponent: about, title: `${baseTitle} - About` },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'child-profile', loadComponent: child, title: `${baseTitle} - Child Profile` },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
