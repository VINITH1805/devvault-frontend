import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { VaultHistory } from './components/vault-history/vault-history';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'history', component: VaultHistory },
  { path: '**', redirectTo: 'dashboard' }
];
