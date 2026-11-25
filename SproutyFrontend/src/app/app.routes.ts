import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { Home } from './features/home';
import { AuthPage } from './features/auth';
import { PlantLibrary } from './features/plant-library';
import { AddPlant } from './features/add-plant';
import { MyPlants } from './features/my-plants';
import { Overview } from './features/overview';
import { Dashboard } from './features/dashboard';
import { ReadingsForm } from './features/readings-form';
import { Notifications } from './features/notifications';
import { ForgotPassword } from './features/forgot-password';
import { ResetPassword } from './features/reset-password';
import { EditPlant } from './features/edit-plant';
import { Profile } from './features/profile';
import { Settings } from './features/settings';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: Home },
  { path: 'overview', component: Overview, canActivate: [authGuard] },
  { path: 'login', component: AuthPage, data: { mode: 'login' } },
  { path: 'register', component: AuthPage, data: { mode: 'register' } },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'plants', component: PlantLibrary },
  { path: 'plants/:id', component: AddPlant, canActivate: [authGuard] },
  { path: 'add-plant', component: AddPlant, canActivate: [authGuard] },
  { path: 'edit-plant/:id', component: EditPlant, canActivate: [authGuard] },
  { path: 'my-plants', component: MyPlants, canActivate: [authGuard] },
  { path: 'dashboard/:id', component: Dashboard, canActivate: [authGuard] },
  { path: 'readings/:id', component: ReadingsForm, canActivate: [authGuard] },
  { path: 'notifications', component: Notifications, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
