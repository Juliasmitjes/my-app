import { Routes } from '@angular/router';
import { Services } from './pages/services/services';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: 'services', component: Services },
  { path: '**', component: NotFound } // catch-all
];