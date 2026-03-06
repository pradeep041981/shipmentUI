import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login.component';
import { ShipmentFormComponent } from './components/shipment-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShipmentFormComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
