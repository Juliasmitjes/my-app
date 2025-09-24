import { Routes } from '@angular/router';
import { Home } from '../app/pages/home/home';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: '**', component: NotFoundComponent } // catch-all
];