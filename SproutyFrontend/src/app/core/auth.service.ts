import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, tap } from 'rxjs';
import { API_URL, USE_MOCK_AUTH } from './config';
import { ApiAuthResponse, AuthResponse } from '../models';

const toAuth = (r: ApiAuthResponse): AuthResponse => ({
  token: r.token, expiresAt: r.expiresAt, user: { id: r.userId, name: r.name, email: r.email, role: r.role },
});

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  user = signal<AuthResponse['user'] | null>(JSON.parse(localStorage.getItem('user') ?? 'null'));

  constructor() { void this.isLoggedIn; }   // clears an expired session on startup

  get token() { return localStorage.getItem('token'); }
  get isAdmin() { return this.user()?.role === 'Admin'; }
  get isLoggedIn() {
    if (!this.token) return false;
    const exp = localStorage.getItem('expiresAt');
    if (exp && Date.parse(exp) <= Date.now()) { this.logout(); return false; }
    return true;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const req$ = USE_MOCK_AUTH ? this.mock(email.split('@')[0], email)
      : this.http.post<ApiAuthResponse>(`${API_URL}/auth/login`, { email, password }).pipe(map(toAuth));
    return req$.pipe(tap(r => this.save(r)));
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    const req$ = USE_MOCK_AUTH ? this.mock(name, email)
      : this.http.post<ApiAuthResponse>(`${API_URL}/auth/register`, { name, email, password }).pipe(map(toAuth));
    return req$.pipe(tap(r => this.save(r)));
  }

  logout() {
    ['token', 'user', 'expiresAt'].forEach(k => localStorage.removeItem(k));
    this.user.set(null);
  }

  private mock(name: string, email: string) {
    return of<AuthResponse>({ token: 'mock-token', user: { id: 'u1', name, email, role: 'User' } }).pipe(delay(300));
  }
  private save(r: AuthResponse) {
    localStorage.setItem('token', r.token); localStorage.setItem('user', JSON.stringify(r.user));
    if (r.expiresAt) localStorage.setItem('expiresAt', r.expiresAt); else localStorage.removeItem('expiresAt');
    this.user.set(r.user);
  }
}
