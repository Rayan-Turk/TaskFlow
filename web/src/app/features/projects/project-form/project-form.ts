import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from '../../../core/services/project.service';

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

  private projectId = this.route.snapshot.paramMap.get('id');
  isEdit = this.projectId !== null;

  errorMessage = signal('');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  constructor() {
    if (this.projectId) {
      this.projectService.getById(Number(this.projectId)).subscribe({
        next: (project) => this.form.patchValue(project),
        error: () => this.router.navigate(['/projects']),
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage.set('');
    const { name, description } = this.form.getRawValue();

    const request =
      this.projectId !== null
        ? this.projectService.update(Number(this.projectId), { name, description })
        : this.projectService.create({ name, description });

    request.subscribe({
      next: () => this.router.navigate(['/projects']),
      error: (err: HttpErrorResponse) =>
        this.errorMessage.set(
          err.status === 403
            ? 'Only admins can create projects.'
            : 'Something went wrong. Try again.',
        ),
    });
  }
}
