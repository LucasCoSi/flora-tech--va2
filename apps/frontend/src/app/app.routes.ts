import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      {
        path: 'estufas',
        loadComponent: () => import('./features/estufas/estufa-list/estufa-list.component').then(m => m.EstufaListComponent)
      },
      {
        path: 'estufas/nova',
        loadComponent: () => import('./features/estufas/estufa-form/estufa-form.component').then(m => m.EstufaFormComponent)
      },
      {
        path: 'estufas/editar/:id',
        loadComponent: () => import('./features/estufas/estufa-form/estufa-form.component').then(m => m.EstufaFormComponent)
      },
      {
        path: 'ciclos',
        loadComponent: () => import('./features/ciclos-cultivo/ciclo-list/ciclo-list.component').then(m => m.CicloListComponent)
      },
      {
        path: 'ciclos/novo',
        loadComponent: () => import('./features/ciclos-cultivo/ciclo-form/ciclo-form.component').then(m => m.CicloFormComponent)
      },
      {
        path: 'ciclos/editar/:id',
        loadComponent: () => import('./features/ciclos-cultivo/ciclo-form/ciclo-form.component').then(m => m.CicloFormComponent)
      },
      {
        path: 'admin/users',
        canActivate: [adminGuard],
        loadComponent: () => import('./features/admin/user-list/user-list.component').then(m => m.UserListComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
