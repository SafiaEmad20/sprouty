import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, timer } from 'rxjs';
import { PlantsService } from '../services/plants.service';
import { LatestReading, Plant, PlantType, SensorReading } from '../models';
import { Gauge } from '../shared/gauge';
import { HistoryChart } from '../shared/history-chart';

type Metric = 'moisture' | 'temperature' | 'light';

@Component({
  selector: 'app-dashboard',
  imports: [Gauge, HistoryChart, RouterLink, DatePipe],
  template: `
  <div class="container">
    <a routerLink="/my-plants">← My plants</a>
    @if (plant(); as p) {
      <h1>@if (p.imageUrl) { <img class="avatar" [src]="p.imageUrl" alt=""> } @else { <span>{{ type()?.emoji }}</span> } {{ p.nickname }}</h1>
    }
    @if (latest(); as l) {
      <div class="bubble" [class.bad]="l.status.statusType !== 'Healthy'">
        <p class="say">“{{ l.status.message }}”</p>
        <span class="muted">Updated {{ l.reading.recordedAt | date:'mediumTime' }} · refreshes every 15 seconds</span>
      </div>
      @if (type(); as t) { <p class="card sun">☀️ <b>Sun schedule:</b> {{ t.sunSchedule }}</p> }
      <div class="grid g4">
        <app-gauge label="Soil moisture" icon="💧" [value]="l.reading.moisture" [min]="l.requirement.minMoisture" [max]="l.requirement.maxMoisture"/>
        <app-gauge label="Temperature" icon="🌡️" unit="°C" [value]="l.reading.temperature" [min]="l.requirement.minTemperature" [max]="l.requirement.maxTemperature" [scaleMin]="0" [scaleMax]="50"/>
        <app-gauge label="Light" icon="🔆" [value]="l.reading.light" [min]="l.requirement.minLight" [max]="l.requirement.maxLight"/>
      </div>
      <div class="card hist">
        <div class="tabs">
          @for (m of metrics; track m.key) { <button class="btn" [class.ghost]="metric() !== m.key" (click)="metric.set(m.key)">{{ m.label }}</button> }
        </div>
        <app-history-chart [data]="history()" [metric]="metric()" [label]="metric()" [min]="range(l).min" [max]="range(l).max"/>
      </div>
      <p><a class="btn ghost" [routerLink]="['/readings', plant()?.id]">Enter a reading manually</a></p>
    } @else { <p class="muted">Loading readings…</p> }
  </div>`,
  styles: [`
    .bubble{background:#E3EBCF;border-radius:24px 24px 24px 4px;padding:1rem 1.4rem;margin:1rem 0;max-width:640px}
    .bubble.bad{background:#FCEFC8}.say{font:700 1.6rem var(--font-head);margin:0 0 .2rem}
    .sun{margin:1rem 0}.g4{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
    .hist{margin-top:1rem}.tabs{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.8rem}
  `],
})
export class Dashboard {
  private svc = inject(PlantsService);
  private id = inject(ActivatedRoute).snapshot.params['id'];
  plant = signal<Plant | null>(null); type = signal<PlantType | null>(null);
  latest = signal<LatestReading | null>(null); history = signal<SensorReading[]>([]); metric = signal<Metric>('moisture');
  metrics: { key: Metric; label: string }[] = [
    { key: 'moisture', label: 'Moisture' }, { key: 'temperature', label: 'Temperature' }, { key: 'light', label: 'Light' }];

  constructor() {
    this.svc.getPlant(this.id).subscribe(p => { this.plant.set(p); this.svc.getPlantType(p.plantTypeId).subscribe(r => this.type.set(r.type)); });
    this.svc.getReadings(this.id).subscribe(r => this.history.set(r));
    // Live updates: polling now; replace with SignalR later if time allows.
    timer(0, 15000).pipe(switchMap(() => this.svc.getLatest(this.id)), takeUntilDestroyed(inject(DestroyRef))).subscribe(l => this.latest.set(l));
  }
  range(l: LatestReading) {
    const q = l.requirement, m = this.metric();
    return { min: q[('min' + m[0].toUpperCase() + m.slice(1)) as keyof typeof q] as number, max: q[('max' + m[0].toUpperCase() + m.slice(1)) as keyof typeof q] as number };
  }
}
