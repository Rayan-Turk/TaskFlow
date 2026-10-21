import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateTask, Task, TaskPriority, TaskStatus, UpdateTask } from '../models/task.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5102/api';

  getByProject(
    projectId: number,
    page = 1,
    pagesize = 10,
    status?: TaskStatus,
    priority?: TaskPriority,
    assigneeId?: number,
  ) {
    let params = new HttpParams().set('page', page).set('pageSize', pagesize);

    if (status) params = params.set('status', status);

    if (priority) params = params.set('priority', priority);

    if (assigneeId !== undefined) params = params.set('assigneeId', assigneeId);

    return this.http.get<PagedResult<Task>>(`${this.apiUrl}/projects/${projectId}/tasks`, {
      params,
    });
  }

  getById(id: number) {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${id}`);
  }

  create(task: CreateTask) {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  update(id: number, task: UpdateTask) {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, task);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }
}
