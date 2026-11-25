import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <header class="public-nav">
      <a class="public-brand" routerLink="/" aria-label="Sprouty home">
        <span class="brand-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/><path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/></svg></span><span>SPROUTY</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/#how-it-works">How it works</a>
        <a routerLink="/plants">Plant library</a>
        <a href="/#features">Features</a>
      </nav>
      <div class="public-nav-actions">
        <button class="theme-toggle public-theme-toggle" type="button" (click)="theme.toggle()"
          [attr.aria-label]="theme.isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
          <span class="theme-icon" aria-hidden="true">{{ theme.isDark() ? '☼' : '◐' }}</span>
          <span>{{ theme.isDark() ? 'Light mode' : 'Dark mode' }}</span>
        </button>
        <a routerLink="/login" class="nav-login">Log in</a>
        <a routerLink="/register" class="nav-cta">Start growing <span aria-hidden="true">→</span></a>
      </div>
    </header>
  `,
})
export class Navbar {
  theme = inject(ThemeService);
}
