import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from '../../../core/services/project.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  submitting = signal(false);
  private idParam = this.route.snapshot.paramMap.get('id');
  private projectId = this.idParam === null ? null : Number(this.idParam);
  isEdit = this.projectId !== null;

  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  constructor() {
    if (this.projectId !== null) {
      if (Number.isNaN(this.projectId)) {
        this.router.navigate(['/projects']);
        return;
      }

      this.projectService.getById(this.projectId).subscribe({
        next: (project) => this.form.patchValue(project),
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.toast.show('That project no longer exists.');
          }
          this.router.navigate(['/projects']);
        },
      });
    }
  }

  onSubmit() {
    if (this.submitting()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');
    this.submitting.set(true);
    const { name, description } = this.form.getRawValue();

    const request =
      this.projectId !== null
        ? this.projectService.update(this.projectId, { name, description })
        : this.projectService.create({ name, description });

    request.subscribe({
      next: () => {
        this.toast.show(this.isEdit ? 'Project updated' : 'Project created', 'success');
        this.router.navigate(['/projects']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        if (err.status === 404) {
          this.toast.show('That project no longer exists.');
          this.router.navigate(['/projects']);
        } else if (err.status === 400) {
          this.errorMessage.set('Please check the details and try again.');
        }
      },
    });
  }
}
