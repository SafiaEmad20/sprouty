import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
  <header class="nav">
    <a class="logo" routerLink="/" aria-label="Sprouty home">
      <svg class="mark" viewBox="0 0 40 40" aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="#BE5103"/>
        <ellipse cx="20" cy="31.5" rx="8" ry="2.2" fill="#FDFBD4" opacity=".55"/>
        <path d="M20 31V18" stroke="#FDFBD4" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M20 22C12 22 9 16.5 9 11.5 15 11.5 20 14.5 20 22Z" fill="#FDFBD4"/>
        <path d="M20 18C20 11 24.5 7.5 31 7.5 31 14 27 18 20 18Z" fill="#F0DFA0"/>
      </svg>
      <span>Sprouty</span>
    </a>
    <nav>
      <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      @if (auth.user()) {
        <a routerLink="/plants" routerLinkActive="on">Plant library</a>
        <a routerLink="/my-plants" routerLinkActive="on">My plants</a>
        <a routerLink="/notifications" routerLinkActive="on">Alerts
          @if (notes.unread() > 0) { <span class="dot">{{ notes.unread() }}</span> }
        </a>
        <button class="btn ghost" (click)="logout()">Log out</button>
      } @else {
        <a routerLink="/login" routerLinkActive="on">Log in</a>
        <a class="btn join" routerLink="/register">Sign up</a>
      }
    </nav>
  </header>`,
  styles: [`
    .nav{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;padding:.7rem 1.2rem;background:var(--leaf);color:var(--bg)}
    .logo{display:flex;align-items:center;gap:.55rem;font:700 1.55rem var(--font-head);color:var(--bg);text-decoration:none}
    .mark{width:38px;height:38px;transition:transform .3s}.logo:hover .mark{transform:rotate(-12deg) scale(1.08)}
    nav{display:flex;align-items:center;gap:1.1rem;flex-wrap:wrap}
    nav a:not(.btn){color:#F4F1C8;text-decoration:none;font-weight:700;padding-bottom:2px;border-bottom:3px solid transparent}
    nav a.on:not(.btn){color:#fff;border-bottom-color:var(--peach)}
    .dot{background:var(--accent);color:#fff;border-radius:999px;padding:0 .45rem;font-size:.8rem;margin-left:.2rem}
    .btn.ghost{color:var(--bg);border-color:var(--bg);padding:.3rem .9rem}.btn.ghost:hover{background:rgba(253,251,212,.15)}
    .btn.join{color:#fff;padding:.3rem 1rem}
  `],
})
export class Navbar {
  auth = inject(AuthService); notes = inject(NotificationsService); private router = inject(Router);
  constructor() { if (this.auth.isLoggedIn) this.notes.load(); }
  logout() { this.auth.logout(); this.router.navigate(['/login']); }
}
