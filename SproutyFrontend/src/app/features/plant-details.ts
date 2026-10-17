import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlantsService } from '../services/plants.service';
import { PlantRequirement, PlantType } from '../models';

@Component({
  selector: 'app-plant-details',
  imports: [RouterLink, FormsModule],
  template: `
  <div class="container">
    <a routerLink="/plants">← Back to library</a>
    @if (type(); as t) {
      <h1>{{ t.emoji }} {{ t.nameEn }} <span class="muted">{{ t.nameAr }}</span></h1>
      <p>{{ t.careNotes }}</p>
      <div class="cols">
        <div class="card"><h2>Care steps</h2><ol>@for (s of t.careSteps; track s) { <li>{{ s }}</li> }</ol></div>
        <div class="card"><h2>When to put it in the sun</h2><p>☀️ {{ t.sunSchedule }}</p>
          @if (req(); as r) {
            <h2>Ideal conditions</h2>
            <ul>
              <li>💧 Soil moisture {{ r.minMoisture }}–{{ r.maxMoisture }}%</li>
              <li>🌡️ Temperature {{ r.minTemperature }}–{{ r.maxTemperature }}°C</li>
              <li>☀️ Light {{ r.minLight }}–{{ r.maxLight }}%</li>
            </ul>
          }
        </div>
      </div>
      <div class="card add"><h2>Add it to your plants</h2>
        <label for="nick">Give it a nickname</label>
        <input id="nick" [(ngModel)]="nickname" [placeholder]="t.nameEn">
        <p><button class="btn" (click)="add(t)">Add to my plants</button></p>
      </div>
    }
  </div>`,
  styles: [`.cols{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));margin:1rem 0}.add{max-width:420px}`],
})
export class PlantDetails {
  private svc = inject(PlantsService); private router = inject(Router);
  type = signal<PlantType | null>(null); req = signal<PlantRequirement | null>(null); nickname = '';
  constructor() {
    this.svc.getPlantType(inject(ActivatedRoute).snapshot.params['id']).subscribe(r => { this.type.set(r.type); this.req.set(r.requirement); });
  }
  add(t: PlantType) { this.svc.addPlant(t.id, this.nickname.trim() || t.nameEn).subscribe(() => this.router.navigate(['/my-plants'])); }
}
