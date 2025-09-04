import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Overview } from './overview/overview';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'overview', component: Overview }
];
