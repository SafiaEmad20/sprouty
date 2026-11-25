import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../core/config';
import { AppNotification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  items = signal<AppNotification[]>([]);
  private count = signal(0);
  unread = computed(() => this.count());

  load() {
    this.http.get<any[]>(`${API_URL}/notifications`).subscribe({
      next: rows => {
        const items = rows.map(n => ({ ...n, plantNickname: n.plantNickname ?? '', type: n.type ?? 'Info' })) as AppNotification[];
        this.items.set(items);
        this.count.set(items.filter(n => !n.isRead).length);
      },
      error: () => { this.items.set([]); this.count.set(0); },
    });
    this.refreshUnreadCount();
  }
  refreshUnreadCount() {
    this.http.get<any>(`${API_URL}/notifications/unread-count`).subscribe({
      next: result => { const value = typeof result === 'number' ? result : Number(result?.unreadCount ?? result?.count ?? 0); this.count.set(Number.isFinite(value) ? value : 0); },
    });
  }
  markRead(id: string) {
    this.http.put(`${API_URL}/notifications/${id}/read`, {}).subscribe({
      next: () => { this.items.update(rows => rows.map(n => n.id === id ? { ...n, isRead: true } : n)); this.refreshUnreadCount(); },
    });
  }
  markAllRead() {
    this.http.put(`${API_URL}/notifications/read-all`, {}).subscribe({
      next: () => { this.items.update(rows => rows.map(n => ({ ...n, isRead: true }))); this.count.set(0); },
    });
  }
  delete(id: string) {
    this.http.delete(`${API_URL}/notifications/${id}`).subscribe({
      next: () => { this.items.update(rows => rows.filter(n => n.id !== id)); this.refreshUnreadCount(); },
    });
  }
}
