import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, tap } from 'rxjs';
import { API_URL, USE_MOCK } from './config';
import { AuthResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  user = signal<AuthResponse['user'] | null>(JSON.parse(localStorage.getItem('user') ?? 'null'));

  get token() { return localStorage.getItem('token'); }
  get isLoggedIn() { return !!this.token; }

  login(email: string, password: string): Observable<AuthResponse> {
    const req$ = USE_MOCK
      ? of<AuthResponse>({ token: 'mock-token', user: { id: 'u1', name: email.split('@')[0], email } }).pipe(delay(300))
      : this.http.post<AuthResponse>(`${API_URL}/auth/login`, { email, password });
    return req$.pipe(tap(r => this.save(r)));
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    const req$ = USE_MOCK
      ? of<AuthResponse>({ token: 'mock-token', user: { id: 'u1', name, email } }).pipe(delay(300))
      : this.http.post<AuthResponse>(`${API_URL}/auth/register`, { name, email, password });
    return req$.pipe(tap(r => this.save(r)));
  }

  logout() { localStorage.removeItem('token'); localStorage.removeItem('user'); this.user.set(null); }

  private save(r: AuthResponse) {
    localStorage.setItem('token', r.token); localStorage.setItem('user', JSON.stringify(r.user)); this.user.set(r.user);
  }
}
