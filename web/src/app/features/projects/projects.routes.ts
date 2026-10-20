import { Routes } from '@angular/router';
import { ProjectList } from './project-list/project-list';
import { ProjectForm } from './project-form/project-form';
import { adminGuard } from '../../core/guards/admin.guard';

export const projectRoutes: Routes = [
  {
    path: '',
    component: ProjectList,
  },
  {
    path: 'new',
    component: ProjectForm,
    canActivate: [adminGuard],
  },
  {
    path: ':id/edit',
    component: ProjectForm,
  },
  {
    path: ':projectId/tasks',
    loadChildren: () => import('../tasks/tasks.routes').then((m) => m.taskRoutes),
  },
];
