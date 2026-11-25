import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(localStorage.getItem('sprouty-theme') === 'dark');
  constructor() { this.apply(); }
  toggle() { this.isDark.update(value => !value); this.apply(); }
  setDark(value: boolean) { this.isDark.set(value); this.apply(); }
  private apply() {
    const dark = this.isDark();
    document.documentElement.classList.toggle('dark-theme', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    localStorage.setItem('sprouty-theme', dark ? 'dark' : 'light');
  }
}
