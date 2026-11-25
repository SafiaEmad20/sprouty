import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of, switchMap, timer } from 'rxjs';
import { PlantsService } from '../services/plants.service';
import { LatestReading, Plant, PlantType, SensorReading } from '../models';
import { statusTone } from '../core/status';
import { apiErrorMessage } from '../core/api-error';
import { Gauge } from '../shared/gauge';
import { HistoryChart } from '../shared/history-chart';

type Metric = 'moisture' | 'temperature' | 'light';
@Component({ selector: 'app-dashboard', imports: [Gauge, HistoryChart, RouterLink, DatePipe], template: `
  <div class="container dashboard-page"><a routerLink="/my-plants" class="back-link">← My plants</a>
    @if(notFound()){<div class="card"><h2>We couldn't find this plant.</h2><a routerLink="/my-plants">Back to My Plants</a></div>}
    @if(plant(); as p){<div class="plant-hero card"><div class="plant-hero-image">@if(p.imageUrl || type()?.imageUrl){<img [src]="p.imageUrl || type()?.imageUrl" [alt]="p.nickname">} @else {<img src="https://images.unsplash.com/photo-1678712759486-338d7ee04ff2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" [alt]="p.nickname">}</div><div class="plant-hero-copy"><p class="eyebrow">YOUR GREEN FAMILY</p><h1>{{p.nickname}}</h1><p class="muted">{{type()?.nameEn}} · Added {{p.addedAt | date:'mediumDate'}}</p>@if(latest();as l){<span class="status-pill" [class.healthy]="l.status.statusType==='Healthy'" [class.attention]="l.status.statusType!=='Healthy' && l.status.statusType!=='NoData'">{{statusLabel(l.status.statusType)}}</span><p class="plant-voice">“{{l.status.message}}”</p>}</div><div class="plant-actions"><a class="btn-outline" [routerLink]="['/edit-plant',p.id]">Edit plant</a><a class="btn-primary" [routerLink]="['/readings',p.id]">＋ Add reading</a><button class="btn-outline" (click)="deletePlant()">Delete</button></div><small class="sensor-id">Sensor ID: {{p.sensorId || 'Not available'}}</small></div>}
    @if(latest();as l){@if(l.reading && l.requirement){<div class="metric-grid"><app-gauge label="Soil moisture" icon="M" [value]="l.reading.moisture" [min]="l.requirement.minMoisture" [max]="l.requirement.maxMoisture"/><app-gauge label="Temperature" icon="°" unit="°C" [value]="l.reading.temperature" [min]="l.requirement.minTemperature" [max]="l.requirement.maxTemperature" [scaleMin]="0" [scaleMax]="50"/><app-gauge label="Air humidity" icon="H" [value]="l.reading.humidity" [min]="l.requirement.minHumidity" [max]="l.requirement.maxHumidity"/><app-gauge label="Light level" icon="L" [value]="l.reading.light" [min]="l.requirement.minLight" [max]="l.requirement.maxLight"/></div><div class="card chart-card"><div class="section-heading"><div><p class="eyebrow">GROWTH OVER TIME</p><h2>Your plant's history</h2></div><div class="tabs">@for(m of metrics;track m.key){<button [class.selected]="metric()===m.key" (click)="metric.set(m.key)">{{m.label}}</button>}</div></div><app-history-chart [data]="history()" [metric]="metric()" [label]="metric()" [min]="range(l).min" [max]="range(l).max"/></div>} @else {<div class="card no-data"><div class="empty-photo"><img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80" alt="Sunlit green houseplants"></div><h2>I'm waiting for my first reading.</h2><p class="muted">Once your sensor sends its first update, your plant's health will appear here.</p><a class="btn-primary" [routerLink]="['/readings',plant()?.id]">Add a manual reading</a></div>}}
    @if(error()){<p class="error">{{error()}}</p>}
  </div>`,
})
export class Dashboard {
  private svc = inject(PlantsService); private id = inject(ActivatedRoute).snapshot.params['id']; private destroyRef = inject(DestroyRef); private router = inject(Router);
  notFound = signal(false); error = signal(''); plant = signal<Plant|null>(null); type = signal<PlantType|null>(null); latest = signal<LatestReading|null>(null); history = signal<SensorReading[]>([]); metric = signal<Metric>('moisture');
  metrics: {key:Metric;label:string}[] = [{key:'moisture',label:'Moisture'},{key:'temperature',label:'Temperature'},{key:'light',label:'Light'}];
  constructor(){
    this.svc.getPlant(this.id).subscribe({next:p=>{this.plant.set(p);this.svc.getPlantType(p.plantTypeId).subscribe({next:r=>this.type.set(r.type),error:e=>this.error.set(apiErrorMessage(e))});},error:()=>this.notFound.set(true)});
    this.svc.getReadings(this.id).subscribe({next:r=>this.history.set(r),error:e=>this.error.set(apiErrorMessage(e,'Could not load reading history.'))});
    timer(0,15000).pipe(switchMap(()=>this.svc.getLatest(this.id).pipe(catchError(e=>{this.error.set(apiErrorMessage(e,'Live readings are temporarily unavailable.'));return of(null);}))),takeUntilDestroyed(this.destroyRef)).subscribe(l=>{if(l)this.latest.set(l);});
  }
  statusLabel(s:string){return s==='Healthy'?'Looking good':s==='NoData'?'Waiting for data':'Needs a little love';}
  deletePlant(){const p=this.plant();if(!p||!confirm(`Delete ${p.nickname} and its history?`))return;this.svc.deletePlant(p.id).subscribe({next:()=>this.router.navigate(['/my-plants']),error:e=>this.error.set(apiErrorMessage(e,'Could not delete this plant.'))});}
  range(l:LatestReading){const q=l.requirement!;const m=this.metric();return {min:q[('min'+m[0].toUpperCase()+m.slice(1)) as keyof typeof q] as number,max:q[('max'+m[0].toUpperCase()+m.slice(1)) as keyof typeof q] as number};}
}
