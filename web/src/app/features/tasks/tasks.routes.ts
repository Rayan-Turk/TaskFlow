import { Routes } from '@angular/router';
import { TaskList } from './task-list/task-list';
import { TaskForm } from './task-form/task-form';

export const taskRoutes: Routes = [
  {
    path: '',
    component: TaskList,
  },
  {
    path: 'new',
    component: TaskForm,
  },
  {
    path: ':id/edit',
    component: TaskForm,
  },
];
