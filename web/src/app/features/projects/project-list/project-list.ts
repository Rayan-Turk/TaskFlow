import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
})
export class ProjectList {
  private auth = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {
    this.http.get('http://localhost:5102/api/projects').subscribe({
      next: (res) => console.log('projects', res),
      error: (err) => console.log('failed', err.status),
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
