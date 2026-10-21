import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.model';
import { DatePipe } from '@angular/common';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Pager } from '../../../shared/components/pager/pager';

@Component({
  selector: 'app-project-list',
  imports: [RouterLink, DatePipe, ConfirmDialog, Pager],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  private auth = inject(AuthService);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  loading = signal(true);
  totalCount = signal(0);
  page = signal(1);
  pageSize = 2;

  projects = signal<Project[]>([]);
  isAdmin = this.auth.isAdmin;

  constructor() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    this.projectService.getAll(this.page(), this.pageSize).subscribe({
      next: (res) => {
        this.projects.set(res.items);
        this.totalCount.set(res.totalCount);
        this.loading.set(false);
      },
      error: (err) => {
        console.log('failed', err.status);
        this.loading.set(false);
      },
    });
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.loadProjects();
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
        this.projectToDelete.set(null);
        if (this.projects().length === 1 && this.page() > 1) {
          this.page.update((p) => p - 1);
        }
        this.loadProjects();
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
