import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlantsService } from '../services/plants.service';
import { apiErrorMessage } from '../core/api-error';
import { PlantType } from '../models';

@Component({
  selector: 'app-plant-library',
  imports: [RouterLink],
  template: `
  <div class="container">
    <h1>Plant library</h1>
    <p class="muted">Pick a plant to see how to care for it.</p>
    <div class="filters">
      <input type="search" placeholder="Search plants" aria-label="Search plants" (input)="q.set($any($event.target).value)">
      @for (c of categories(); track c) {
        <button class="btn" [class.ghost]="cat() !== c" (click)="cat.set(c)">{{ c }}</button>
      }
    </div>
    @if (error()) {
      <div class="card err"><p class="error">{{ error() }}</p><button class="btn" (click)="load()">Try again</button></div>
    } @else if (loading()) {
      <p class="muted">Loading plants…</p>
    }
    @for (g of groups(); track g.name) {
      <h2 class="cat">{{ g.name }}</h2>
      <div class="grid">
        @for (t of g.items; track t.id) {
          <a class="card item" [routerLink]="['/plants', t.id]">
            @if (t.imageUrl) { <img class="photo" [src]="t.imageUrl" [alt]="t.nameEn"> } @else { <div class="thumb">{{ t.emoji }}</div> }
            <h3>{{ t.nameEn }}</h3><span class="muted">{{ t.nameAr }}</span>
          </a>
        }
      </div>
    } @empty { @if (!loading() && !error()) { <p class="muted">No plants match your search.</p> } }
  </div>`,
  styles: [`.filters{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}.filters input{max-width:260px}.cat{margin-top:1.5rem}.item{text-decoration:none;color:inherit}.item:hover{border-color:var(--leaf)}.err{max-width:460px}`],
})
export class PlantLibrary {
  private svc = inject(PlantsService);
  types = signal<PlantType[]>([]); q = signal(''); cat = signal('All');
  loading = signal(true); error = signal('');
  categories = computed(() => ['All', ...new Set(this.types().map(t => t.category))]);
  groups = computed(() => {
    const list = this.types().filter(t => (this.cat() === 'All' || t.category === this.cat()) && (t.nameEn + t.nameAr).toLowerCase().includes(this.q().toLowerCase()));
    return [...new Set(list.map(t => t.category))].map(name => ({ name, items: list.filter(t => t.category === name) }));
  });
  constructor() { this.load(); }
  load() {
    this.loading.set(true); this.error.set('');
    this.svc.getPlantTypes().subscribe({
      next: r => { this.types.set(r); this.loading.set(false); },
      error: e => { this.loading.set(false); this.error.set(apiErrorMessage(e, 'Could not load the plant library.')); },
    });
  }
}
