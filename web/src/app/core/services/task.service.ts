import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateTask, Task, UpdateTask } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5102/api';

  getByProject(projectId: number) {
    return this.http.get<Task[]>(`${this.apiUrl}/projects/${projectId}/tasks`);
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
