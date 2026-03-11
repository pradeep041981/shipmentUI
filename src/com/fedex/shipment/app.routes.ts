import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login.component';
import { ShipmentFormComponent } from './components/shipment-form.component';
import { AuthCallbackComponent } from './components/auth-callback.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: '',
    component: ShipmentFormComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
