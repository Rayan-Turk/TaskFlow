import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskStatus, TaskPriority } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-task-form',
  styleUrl: './task-form.scss',
  templateUrl: './task-form.html',
})
export class TaskForm {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectId = Number(this.route.snapshot.paramMap.get('projectId'));
  private idParam = this.route.snapshot.paramMap.get('id');
  private taskId = this.idParam === null ? null : Number(this.idParam);
  isEdit = this.taskId !== null;

  users = signal<User[]>([]);
  errorMessage = signal('');

  statuses: TaskStatus[] = ['Todo', 'InProgress', 'Done'];
  priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  statusLabels: Record<TaskStatus, string> = {
    Todo: 'To do',
    InProgress: 'In progress',
    Done: 'Done',
  };

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: [''],
    status: ['Todo' as TaskStatus],
    priority: ['Medium' as TaskPriority],
    dueDate: ['', [Validators.required]],
    assignedToUserId: [0],
  });

  constructor() {
    if (Number.isNaN(this.projectId) || (this.isEdit && Number.isNaN(this.taskId))) {
      this.router.navigate(['/projects']);
      return;
    }

    if (!this.isEdit) {
      const assignee = this.form.controls.assignedToUserId;
      assignee.addValidators(Validators.min(1));
      assignee.updateValueAndValidity();

      this.userService.getAll().subscribe({
        next: (res) => this.users.set(res),
        error: () => this.errorMessage.set('Could not load users.'),
      });
    } else {
      this.taskService.getById(this.taskId!).subscribe({
        next: (task) => this.form.patchValue({ ...task, dueDate: task.dueDate.slice(0, 10) }),
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.router.navigate(['/projects', this.projectId, 'tasks']);
          }
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');

    const { title, description, status, priority, dueDate, assignedToUserId } =
      this.form.getRawValue();

    const request = this.isEdit
      ? this.taskService.update(this.taskId!, { title, description, status, priority, dueDate })
      : this.taskService.create({
          title,
          description,
          status,
          priority,
          dueDate,
          projectId: this.projectId,
          assignedToUserId,
        });

    request.subscribe({
      next: () => this.router.navigate(['/projects', this.projectId, 'tasks']),
      error: () => this.errorMessage.set('Something went wrong. Try again.'),
    });
  }
}
