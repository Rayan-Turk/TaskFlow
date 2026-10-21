import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateProject, Project, UpdateProject } from '../models/project.model';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5102/api/projects';

  getAll(page = 1, pagesize = 10) {
    const params = new HttpParams().set('page', page).set('pageSize', pagesize);

    return this.http.get<PagedResult<Project>>(this.apiUrl, { params });
  }
  getById(id: number) {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }
  create(project: CreateProject) {
    return this.http.post<Project>(this.apiUrl, project);
  }
  update(id: number, project: UpdateProject) {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }
  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
