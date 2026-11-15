import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { API_URL, USE_MOCK } from '../core/config';
import { statusTone } from '../core/status';
import { userKey } from '../core/user-storage';
import { AppNotification, LatestReading, Plant } from '../models';
import { PlantsService } from './plants.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private http = inject(HttpClient);
  private plants = inject(PlantsService);
  items = signal<AppNotification[]>([]);
  unread = computed(() => this.items().filter(n => !n.isRead).length);

  private readSet(): Set<string> { try { return new Set<string>(JSON.parse(localStorage.getItem(userKey('read')) ?? '[]')); } catch { return new Set(); } }

  load() {
    if (!USE_MOCK) { this.http.get<AppNotification[]>(`${API_URL}/notifications`).subscribe(r => this.items.set(r)); return; }
    // Mock: an alert for every one of the user's plants that is not healthy right now.
    this.plants.getMyPlants().pipe(
      switchMap(list => list.length
        ? forkJoin(list.map(p => this.plants.getLatest(p.id).pipe(map(l => ({ p, l })))))
        : of([] as { p: Plant; l: LatestReading }[])),
    ).subscribe({
      next: rows => {
        const read = this.readSet();
        this.items.set(rows.filter(r => statusTone(r.l.status.statusType) === 'bad').map(({ p, l }) => ({
          id: 'n-' + p.id, plantId: p.id, title: `${p.nickname} needs attention`, message: l.status.message,
          type: l.status.statusType, isRead: read.has('n-' + p.id), createdAt: l.reading.recordedAt,
        })));
      },
      error: () => this.items.set([]),
    });
  }
  markRead(id: string) {
    this.items.update(l => l.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    if (USE_MOCK) { try { localStorage.setItem(userKey('read'), JSON.stringify([...this.readSet().add(id)])); } catch { /* ignore */ } }
    else this.http.put(`${API_URL}/notifications/${id}/read`, {}).subscribe();
  }
  markAllRead() { this.items().filter(n => !n.isRead).forEach(n => this.markRead(n.id)); }
}
