import { Component, computed, input } from '@angular/core';
import { SensorReading } from '../models';

/** Lightweight SVG line chart (no extra dependency) with the ideal band shaded. */
@Component({
  selector: 'app-history-chart',
  template: `
  <svg viewBox="0 0 600 200" preserveAspectRatio="none" role="img" [attr.aria-label]="label() + ' over the last 24 hours'">
    <rect x="0" [attr.y]="band().y" width="600" [attr.height]="band().h" fill="#C9D6B4" opacity=".7"/>
    <polyline [attr.points]="points()" fill="none" stroke="#654321" stroke-width="3" stroke-linejoin="round"/>
  </svg>
  <div class="muted axis"><span>24h ago</span><span>now</span></div>`,
  styles: [`svg{width:100%;height:200px;display:block;background:#FFFEF3;border-radius:12px} .axis{display:flex;justify-content:space-between;font-size:.85rem}`],
})
export class HistoryChart {
  data = input.required<SensorReading[]>(); metric = input.required<'moisture' | 'temperature' | 'light'>();
  min = input.required<number>(); max = input.required<number>(); label = input('');

  private range = computed(() => {
    const v = this.data().map(d => d[this.metric()]);
    const lo = Math.min(this.min(), ...v) - 5, hi = Math.max(this.max(), ...v) + 5;
    return { lo, hi };
  });
  private y(v: number) { const { lo, hi } = this.range(); return 200 - ((v - lo) / (hi - lo)) * 200; }
  band = computed(() => ({ y: this.y(this.max()), h: this.y(this.min()) - this.y(this.max()) }));
  points = computed(() => { const d = this.data(); return d.map((r, i) => `${(i / Math.max(1, d.length - 1)) * 600},${this.y(r[this.metric()])}`).join(' '); });
}
