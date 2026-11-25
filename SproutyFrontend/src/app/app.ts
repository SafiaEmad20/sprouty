import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/auth.service';
import { ThemeService } from './core/theme.service';
import { NotificationsService } from './services/notifications.service';
import { Navbar } from './shared/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Navbar],
  template: `
    @if (auth.user()) {
      <div class="app-shell">
        <aside class="sidebar">
          <a class="brand" routerLink="/overview"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/><path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/></svg></span><span>SPROUTY</span></a>
          <p class="side-label">YOUR GARDEN</p>
          <nav class="side-nav" aria-label="Garden navigation">
            <a routerLink="/overview" routerLinkActive="active"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m3.5 10 8.5-7 8.5 7v10h-6v-6h-5v6h-6z"/></svg></span> Overview</a>
            <a routerLink="/my-plants" routerLinkActive="active"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21V9m0 5C5 14 4 9 5 5c5 0 8 2 7 7m0 1c0-6 4-9 8-9 1 6-2 10-8 10"/></svg></span> My Plants</a>
            <a routerLink="/plants" routerLinkActive="active"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5"/></svg></span> Plant Library</a>
            <a routerLink="/add-plant" routerLinkActive="active"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 4v16M4 12h16"/></svg></span> Add Plant</a>
            <a routerLink="/notifications" routerLinkActive="active"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg></span> Notifications @if (notes.unread() > 0) { <b class="side-count">{{ notes.unread() }}</b> }</a>
          </nav>
          <div class="sidebar-bottom">
            <div class="tip-card"><span>A LITTLE TIP</span><p>Every leaf tells a story. Take a moment to listen.</p></div>
            <div class="sidebar-account">
              <a class="profile-row" routerLink="/profile" routerLinkActive="active">
                <span class="profile-avatar">{{ auth.user()?.name?.charAt(0)?.toUpperCase() }}</span>
                <span class="profile-copy"><b>{{ auth.user()?.name }}</b><small>{{ auth.user()?.email }}</small></span>
              </a>
              <a class="account-link" routerLink="/settings" routerLinkActive="active"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z"/></svg></span> Settings</a>
              <button class="account-link logout-link" type="button" (click)="logout()"><span class="nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M10 4H5v16h5M14 8l4 4-4 4m4-4H9"/></svg></span> Log out</button>
            </div>
          </div>
        </aside>
        <section class="workspace">
          <header class="topbar">
            <div class="search-placeholder">
              <span aria-hidden="true">⌕</span>
              <input aria-label="Search your garden" placeholder="Search your garden..." [value]="searchQuery"
                (input)="searchQuery=$any($event.target).value" (keydown.enter)="goToLibrary()">
              <kbd>↵</kbd>
            </div>
            <div class="top-actions">
              <a class="notification-link" routerLink="/notifications" aria-label="Notifications"><svg viewBox="0 0 24 24"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg> @if (notes.unread() > 0) { <i>{{ notes.unread() }}</i> }</a>
              <button class="theme-toggle" type="button" (click)="theme.toggle()"
                [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
                <span class="theme-icon" aria-hidden="true">{{ theme.isDark() ? '☼' : '◐' }}</span>
                <span>{{ theme.isDark() ? 'Light mode' : 'Dark mode' }}</span>
              </button>
            </div>
          </header>
          <main class="page-content"><router-outlet /></main>
        </section>
      </div>
    } @else {
      @if (isAuthRoute()) {
        <a class="auth-close" routerLink="/" aria-label="Back to home">×</a>
      } @else {
        <app-navbar />
      }
      <router-outlet />
    }
  `,
})
export class App {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  notes = inject(NotificationsService);
  private router = inject(Router);
  searchQuery = '';
  isAuthRoute = signal(['/login', '/register', '/forgot-password', '/reset-password'].includes(this.router.url.split('?')[0]));

  goToLibrary() {
    this.router.navigate(['/my-plants'], { queryParams: { q: this.searchQuery || null } });
  }

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const url = (event as NavigationEnd).urlAfterRedirects.split('?')[0];
      this.isAuthRoute.set(['/login', '/register', '/forgot-password', '/reset-password'].includes(url));
    });
    effect(() => {
      if (this.auth.user()) this.notes.load();
      else this.notes.items.set([]);
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
