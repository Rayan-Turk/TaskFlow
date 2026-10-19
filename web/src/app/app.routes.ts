import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Shell } from './core/layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      {
        path: 'projects',
        loadChildren: () =>
          import('./features/projects/projects.routes').then((m) => m.projectRoutes),
      },
      // tasks, and anything else for logged-in users, goes here later
    ],
  },
  { path: '**', redirectTo: 'projects' },
];
