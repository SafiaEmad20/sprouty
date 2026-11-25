import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  template: `
    <div class="container account-page">
      <p class="eyebrow">MAKE SPROUTY YOURS</p>
      <div class="section-heading"><div><h1>Settings.</h1><p class="muted">A calmer space, the way you like it.</p></div></div>
      <section class="card settings-card">
        <div class="settings-row">
          <div class="settings-icon" aria-hidden="true">◐</div>
          <div class="settings-copy"><h3>Appearance</h3><p class="muted">Choose the theme that feels most comfortable.</p></div>
          <button class="theme-choice" type="button" (click)="theme.toggle()">
            <span aria-hidden="true">{{ theme.isDark() ? '☀' : '☾' }}</span>
            {{ theme.isDark() ? 'Switch to light' : 'Switch to dark' }}
          </button>
        </div>
        <div class="settings-preview">
          <div class="preview-swatch light"><span></span><span></span><span></span></div>
          <div class="preview-swatch dark"><span></span><span></span><span></span></div>
          <div class="settings-current"><b>{{ theme.isDark() ? 'Dark appearance' : 'Light appearance' }}</b><small>Your choice is saved on this device.</small></div>
        </div>
      </section>
      <section class="card settings-card settings-secondary">
        <div><h3>Account</h3><p class="muted">View your account information and sign-in details.</p></div>
        <a class="btn-outline" routerLink="/profile">View profile</a>
      </section>
    </div>
  `,
})
export class Settings {
  theme = inject(ThemeService);
}
