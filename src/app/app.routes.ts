import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Overview } from './overview/overview';
import { Details } from './details/details';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'overview', component: Overview },
  { path: 'details/:id', component: Details },
];
