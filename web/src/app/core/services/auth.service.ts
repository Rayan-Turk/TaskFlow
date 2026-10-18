import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5102/api/auth';

  private token = signal<string | null>(localStorage.getItem('token'));
  isLoggedIn = computed(() => this.token() !== null);

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((res) => this.saveSession(res)));
  }
  register(fullName: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { fullName, email, password })
      .pipe(tap((res) => this.saveSession(res)));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    this.token.set(null);
  }

  getToken() {
    return this.token();
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('fullName', res.fullName);
    localStorage.setItem('role', res.role);
    this.token.set(res.token);
  }
}
