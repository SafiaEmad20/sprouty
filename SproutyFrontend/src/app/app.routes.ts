import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { Home } from './features/home';
import { AuthPage } from './features/auth';
import { PlantLibrary } from './features/plant-library';
import { PlantDetails } from './features/plant-details';
import { MyPlants } from './features/my-plants';
import { Dashboard } from './features/dashboard';
import { ReadingsForm } from './features/readings-form';
import { Notifications } from './features/notifications';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'login', component: AuthPage, data: { mode: 'login' } },
  { path: 'register', component: AuthPage, data: { mode: 'register' } },
  { path: 'plants', component: PlantLibrary, canActivate: [authGuard] },
  { path: 'plants/:id', component: PlantDetails, canActivate: [authGuard] },
  { path: 'my-plants', component: MyPlants, canActivate: [authGuard] },
  { path: 'dashboard/:id', component: Dashboard, canActivate: [authGuard] },
  { path: 'readings/:id', component: ReadingsForm, canActivate: [authGuard] },
  { path: 'notifications', component: Notifications, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
