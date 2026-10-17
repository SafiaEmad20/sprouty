import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlantsService } from '../services/plants.service';
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
    @for (g of groups(); track g.name) {
      <h2 class="cat">{{ g.name }}</h2>
      <div class="grid">
        @for (t of g.items; track t.id) {
          <a class="card item" [routerLink]="['/plants', t.id]">
            <div class="thumb">{{ t.emoji }}</div>
            <h3>{{ t.nameEn }}</h3><span class="muted">{{ t.nameAr }}</span>
          </a>
        }
      </div>
    } @empty { <p class="muted">No plants match your search.</p> }
  </div>`,
  styles: [`.filters{display:flex;gap:.5rem;flex-wrap:wrap;margin:1rem 0}.filters input{max-width:260px}.cat{margin-top:1.5rem}.item{text-decoration:none;color:inherit}.item:hover{border-color:var(--leaf)}`],
})
export class PlantLibrary {
  types = signal<PlantType[]>([]); q = signal(''); cat = signal('All');
  categories = computed(() => ['All', ...new Set(this.types().map(t => t.category))]);
  groups = computed(() => {
    const list = this.types().filter(t => (this.cat() === 'All' || t.category === this.cat()) && (t.nameEn + t.nameAr).toLowerCase().includes(this.q().toLowerCase()));
    return [...new Set(list.map(t => t.category))].map(name => ({ name, items: list.filter(t => t.category === name) }));
  });
  constructor() { inject(PlantsService).getPlantTypes().subscribe(r => this.types.set(r)); }
}
