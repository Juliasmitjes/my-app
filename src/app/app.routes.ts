import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'services', component: Services },
  { path: '**', component: NotFound }
];