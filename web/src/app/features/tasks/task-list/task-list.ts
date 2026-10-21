import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Pager } from '../../../shared/components/pager/pager';

@Component({
  imports: [RouterLink, DatePipe, ConfirmDialog, Pager],
  selector: 'app-task-list',
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  isAdmin = this.auth.isAdmin;

  projectId = Number(this.route.snapshot.paramMap.get('projectId'));

  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  loading = signal(true);
  taskToDelete = signal<Task | null>(null);
  totalCount = signal(0);
  page = signal(1);
  pageSize = 2;
  statusFilter = signal<TaskStatus | ''>('');
  priorityFilter = signal<TaskPriority | ''>('');

  statusLabels: Record<TaskStatus, string> = {
    Todo: 'To do',
    InProgress: 'In progress',
    Done: 'Done',
  };
  private validStatuses: TaskStatus[] = ['Todo', 'InProgress', 'Done'];
  private validPriorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  constructor() {
    if (Number.isNaN(this.projectId)) {
      this.router.navigate(['/projects']);
      return;
    }

    this.projectService.getById(this.projectId).subscribe({
      next: (res) => this.project.set(res),
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.router.navigate(['/projects']);
        }
      },
    });

    const q = this.route.snapshot.queryParamMap;
    const status = q.get('status') as TaskStatus;
    const priority = q.get('priority') as TaskPriority;

    this.statusFilter.set(this.validStatuses.includes(status) ? status : '');
    this.priorityFilter.set(this.validPriorities.includes(priority) ? priority : '');
    this.page.set(Math.max(1, Number(q.get('page')) || 1));
    this.loadTasks();
  }
  loadTasks() {
    this.loading.set(true);
    this.taskService
      .getByProject(
        this.projectId,
        this.page(),
        this.pageSize,
        this.statusFilter() || undefined,
        this.priorityFilter() || undefined,
      )
      .subscribe({
        next: (res) => {
          this.tasks.set(res.items);
          this.totalCount.set(res.totalCount);
          this.loading.set(false);
        },
        error: (err) => {
          console.log('tasks failed', err.status);
          this.loading.set(false);
        },
      });
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.syncUrl();
    this.loadTasks();
  }

  private syncUrl() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: this.statusFilter() || null,
        priority: this.priorityFilter() || null,
        page: this.page() > 1 ? this.page() : null,
      },
      replaceUrl: true,
    });
  }

  onStatusChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as TaskStatus | '';
    this.statusFilter.set(value);
    this.page.set(1);
    this.syncUrl();
    this.loadTasks();
  }

  onPriorityChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as TaskPriority | '';
    this.priorityFilter.set(value);
    this.page.set(1);
    this.syncUrl();
    this.loadTasks();
  }

  clearFilters() {
    this.statusFilter.set('');
    this.priorityFilter.set('');
    this.page.set(1);
    this.syncUrl();
    this.loadTasks();
  }

  askDelete(task: Task) {
    this.taskToDelete.set(task);
  }

  cancelDelete() {
    this.taskToDelete.set(null);
  }

  confirmDelete() {
    const task = this.taskToDelete();
    if (!task) return;

    this.taskService.delete(task.id).subscribe({
      next: () => {
        this.taskToDelete.set(null);
        if (this.tasks().length === 1 && this.page() > 1) {
          this.page.update((p) => p - 1);
        }
        this.syncUrl();
        this.loadTasks();
      },
      error: (err) => {
        console.log('delete failed', err.status);
        this.taskToDelete.set(null);
      },
    });
  }
}
