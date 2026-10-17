import { Component, computed, input } from '@angular/core';

/** A reading shown on a track, with the plant's ideal range highlighted. */
@Component({
  selector: 'app-gauge',
  template: `
  <div class="card g">
    <div class="top"><span>{{ icon() }} {{ label() }}</span><span class="badge" [class]="state()">{{ stateText() }}</span></div>
    <div class="val">{{ value() }}<small>{{ unit() }}</small></div>
    <div class="track" role="img" [attr.aria-label]="label() + ' ' + value() + unit() + ', ideal ' + min() + ' to ' + max()">
      <div class="ideal" [style.left.%]="pos(min())" [style.width.%]="pos(max()) - pos(min())"></div>
      <div class="marker" [style.left.%]="pos(value())"></div>
    </div>
    <div class="muted range">Ideal {{ min() }}–{{ max() }}{{ unit() }}</div>
  </div>`,
  styles: [`
    .g{padding:1rem} .top{display:flex;justify-content:space-between;align-items:center;font-weight:700}
    .val{font:700 2.4rem var(--font-head)} small{font-size:1rem;color:var(--muted);margin-left:.15rem}
    .track{position:relative;height:12px;background:#EDE8C2;border-radius:99px;margin:.4rem 0}
    .ideal{position:absolute;top:0;bottom:0;background:#C9D6B4;border-radius:99px}
    .marker{position:absolute;top:-4px;width:6px;height:20px;border-radius:3px;background:var(--ink);transform:translateX(-50%);transition:left .6s}
    .range{font-size:.85rem}
  `],
})
export class Gauge {
  label = input.required<string>(); icon = input(''); unit = input('%');
  value = input.required<number>(); min = input.required<number>(); max = input.required<number>();
  scaleMin = input(0); scaleMax = input(100);

  pos(v: number) { const a = this.scaleMin(), b = this.scaleMax(); return Math.max(0, Math.min(100, ((v - a) / (b - a)) * 100)); }
  state = computed(() => {
    const v = this.value(), span = this.max() - this.min();
    if (v < this.min() || v > this.max()) return 'bad';
    return v < this.min() + span * 0.1 || v > this.max() - span * 0.1 ? 'warn' : 'ok';
  });
  stateText = computed(() => ({ ok: 'In range', warn: 'Near limit', bad: this.value() < this.min() ? 'Too low' : 'Too high' }[this.state()]));
}
