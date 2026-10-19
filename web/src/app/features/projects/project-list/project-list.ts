import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { DatePipe } from '@angular/common';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-project-list',
  imports: [RouterLink, DatePipe, ConfirmDialog],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  private auth = inject(AuthService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  loading = signal(true);

  projects = signal<Project[]>([]);
  isAdmin = this.auth.isAdmin;

  constructor() {
    this.projectService.getAll().subscribe({
      next: (res) => {
        this.projects.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        console.log('failed', err.status);
        this.loading.set(false);
      },
    });
  }
  projectToDelete = signal<Project | null>(null);

  askDelete(project: Project) {
    this.projectToDelete.set(project);
  }

  confirmDelete() {
    const project = this.projectToDelete();
    if (!project) return;

    this.projectService.delete(project.id).subscribe({
      next: () => {
        this.projects.update((list) => list.filter((p) => p.id !== project.id));
        this.projectToDelete.set(null);
      },
      error: (err) => {
        console.log('delete failed', err.status);
        this.projectToDelete.set(null);
      },
    });
  }

  cancelDelete() {
    this.projectToDelete.set(null);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
