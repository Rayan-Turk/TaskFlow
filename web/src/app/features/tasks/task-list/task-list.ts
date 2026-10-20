import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  imports: [RouterLink, DatePipe, ConfirmDialog],
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

  statusLabels: Record<TaskStatus, string> = {
    Todo: 'To do',
    InProgress: 'In progress',
    Done: 'Done',
  };

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

    this.taskService.getByProject(this.projectId).subscribe({
      next: (res) => {
        this.tasks.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.log('tasks failed', err.status);
        this.loading.set(false);
      },
    });
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
        this.tasks.update((list) => list.filter((t) => t.id !== task.id));
        this.taskToDelete.set(null);
      },
      error: (err) => {
        console.log('delete failed', err.status);
        this.taskToDelete.set(null);
      },
    });
  }
}
