import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe, RouterLink],
  template: `
  <div class="container"><h1>Alerts</h1>
    @if (n.unread() > 0) { <button class="btn ghost" (click)="n.markAllRead()">Mark all as read</button> }
    <div class="list">
      @for (x of n.items(); track x.id) {
        <div class="card row" [class.unread]="!x.isRead">
          <div><b>{{ x.title }}</b><p>{{ x.message }}</p><span class="muted">{{ x.createdAt | date:'medium' }}</span></div>
          <div>
            <a class="btn ghost" [routerLink]="['/dashboard', x.plantId]" (click)="n.markRead(x.id)">View plant</a>
            @if (!x.isRead) { <button class="btn" (click)="n.markRead(x.id)">Mark as read</button> }
          </div>
        </div>
      } @empty { <p class="muted">No alerts yet. We'll tell you when a plant needs attention.</p> }
    </div></div>`,
  styles: [`.list{display:grid;gap:.8rem;margin-top:1rem}.row{display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}.unread{border-left:6px solid var(--accent)}`],
})
export class Notifications { n = inject(NotificationsService); constructor() { this.n.load(); } }
