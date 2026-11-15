import { Component, ElementRef, HostListener, computed, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PlantsService } from '../services/plants.service';
import { NotificationsService } from '../services/notifications.service';
import { statusTone } from '../core/status';
import { Plant, PlantStatus, PlantType } from '../models';

interface Row { plant: Plant; type?: PlantType; status?: PlantStatus; }

@Component({
  selector: 'app-my-plants',
  imports: [RouterLink],
  template: `
  <div class="container">
    <div class="head"><h1>My plants</h1>
      @if (rows().length) { <a class="btn" routerLink="/add-plant">+ Add plant</a> }    </div>

    @if (loaded() && !rows().length) {
      <div class="card welcome">
        <h2>Welcome! Which plants do you have?</h2>
        <p class="muted">Pick your first plant and Sprouty will tell you what it needs.</p>
        <a class="btn" routerLink="/add-plant">Choose my first plant</a>
      </div>
    }

    <div class="grid">
      @for (r of rows(); track r.plant.id) {
        <div class="card">
          @if (r.plant.imageUrl) { <img class="photo" [src]="r.plant.imageUrl" [alt]="r.plant.nickname"> }
          @else if (r.type?.imageUrl) { <img class="photo" [src]="r.type!.imageUrl" [alt]="r.type!.nameEn"> }
          @else { <div class="thumb">{{ r.type?.emoji ?? '🌱' }}</div> }
          <h2>{{ r.plant.nickname }}</h2><p class="muted">{{ r.type?.nameEn }}</p>
          @if (r.status; as s) {
            <p>“{{ s.message }}”</p>
            <span class="badge" [class]="tone(s)">{{ label(s) }}</span>
          }
          <div class="actions">
            <a class="btn" [routerLink]="['/dashboard', r.plant.id]">Open dashboard</a>
            <button class="btn ghost" (click)="confirmId.set(r.plant.id)">Remove</button>
          </div>
        </div>
      }
    </div>
  </div>

  @if (confirmRow(); as c) {
    <div class="overlay" (click)="confirmId.set(null)">
      <div class="card dialog" role="alertdialog" aria-modal="true" aria-labelledby="ctitle" (click)="$event.stopPropagation()">
        <h2 id="ctitle">Remove {{ c.plant.nickname }}?</h2>
        <p class="muted">This deletes the plant and its history. You can’t undo it.</p>
        <div class="actions">
          <button class="btn danger" (click)="confirmRemove()">Yes, remove</button>
          <button #keep class="btn ghost" (click)="confirmId.set(null)">No, keep it</button>
        </div>
      </div>
    </div>
  }`,
  styles: [`.head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}.welcome{max-width:520px;margin:1rem 0}`],
})
export class MyPlants {
  private svc = inject(PlantsService); private notes = inject(NotificationsService);
  rows = signal<Row[]>([]); loaded = signal(false);
  confirmId = signal<string | null>(null);
  keepBtn = viewChild<ElementRef<HTMLButtonElement>>('keep');
  confirmRow = computed(() => this.rows().find(r => r.plant.id === this.confirmId()));

  constructor() { this.load(); effect(() => this.keepBtn()?.nativeElement.focus()); }
  @HostListener('document:keydown.escape') onEsc() { this.confirmId.set(null); }

  tone(s: PlantStatus) { return statusTone(s.statusType); }
  label(s: PlantStatus) { return ({ ok: 'Healthy', bad: 'Needs attention', idle: 'No data yet' })[statusTone(s.statusType)]; }

  confirmRemove() { const id = this.confirmId(); if (id) this.svc.deletePlant(id).subscribe(() => { this.confirmId.set(null); this.load(); this.notes.load(); }); }

  load() {
    forkJoin([this.svc.getMyPlants(), this.svc.getPlantTypes()]).subscribe({
      next: ([plants, types]) => {
        this.rows.set(plants.map(plant => ({ plant, type: types.find(t => t.id === plant.plantTypeId) })));
        this.loaded.set(true);
        this.rows().forEach(row => this.svc.getLatest(row.plant.id).subscribe(l => this.rows.update(a => a.map(x => x.plant.id === row.plant.id ? { ...x, status: l.status } : x))));
      },
      error: () => this.loaded.set(true),
    });
  }
}
