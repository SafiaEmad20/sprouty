import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { API_URL, USE_MOCK } from '../core/config';
import { AppNotification } from '../models';
import { MOCK_NOTIFICATIONS } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  items = signal<AppNotification[]>([]);
  unread = computed(() => this.items().filter(n => !n.isRead).length);

  load() {
    if (USE_MOCK) { if (!this.items().length) this.items.set([...MOCK_NOTIFICATIONS]); return; }
    this.http.get<AppNotification[]>(`${API_URL}/notifications`).subscribe(r => this.items.set(r));
  }
  markRead(id: string) {
    this.items.update(l => l.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    if (!USE_MOCK) this.http.put(`${API_URL}/notifications/${id}/read`, {}).subscribe();
  }
  markAllRead() { this.items().filter(n => !n.isRead).forEach(n => this.markRead(n.id)); }
}
