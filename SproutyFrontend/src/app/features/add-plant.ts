import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlantsService } from '../services/plants.service';
import { NotificationsService } from '../services/notifications.service';
import { apiErrorMessage } from '../core/api-error';
import { PlantRequirement, PlantType } from '../models';

/** One page for adding a plant: reached from the library (type preselected) and from "+ Add plant". */
@Component({
  selector: 'app-add-plant',
  imports: [RouterLink, FormsModule],
  template: `
  <div class="container">
    <a routerLink="/my-plants">← My plants</a>
    <h1>Add a plant</h1>
    <p class="muted">Choose your plant, give it a nickname and add a photo if you like.</p>
    @if (error()) { <div class="card err"><p class="error">{{ error() }}</p><button class="btn" (click)="init()">Try again</button></div> }

    <div class="layout">
      <div class="card form">
        <label for="type">Plant type</label>
        <select id="type" [ngModel]="selectedId()" (ngModelChange)="select($event)">
          <option value="" disabled>Choose a plant…</option>
          @for (c of categories(); track c) {
            <optgroup [label]="c">
              @for (t of typesIn(c); track t.id) { <option [value]="t.id">{{ t.emoji }} {{ t.nameEn }} ({{ t.nameAr }})</option> }
            </optgroup>
          }
        </select>

        <label for="nick">Nickname</label>
        <input id="nick" [(ngModel)]="nickname" [placeholder]="type()?.nameEn ?? 'e.g. Bassil'">

        <label for="photo">Photo of your plant (optional)</label>
        <input id="photo" type="file" accept="image/*" (change)="onFile($event)">
        @if (photoError()) { <p class="error">{{ photoError() }}</p> }
        <div class="preview">
          @if (photo()) { <img class="photo" [src]="photo()" alt="Preview of your plant"> }
          @else if (type()?.imageUrl) { <img class="photo" [src]="type()!.imageUrl" [alt]="type()!.nameEn"> }
          @else { <div class="thumb">{{ type()?.emoji ?? '🌱' }}</div> }
          @if (!photo()) { <p class="muted">No photo? We’ll show a picture for this plant type instead.</p> }
        </div>

        @if (saveError()) { <p class="error">{{ saveError() }}</p> }
        <div class="actions">
          <button class="btn" [disabled]="!type() || saving()" (click)="save()">{{ saving() ? 'Saving…' : 'Save plant' }}</button>
          <a class="btn ghost" routerLink="/my-plants">Cancel</a>
        </div>
      </div>

      @if (type(); as t) {
        <div class="info">
          <div class="card">
            <h2>{{ t.emoji }} {{ t.nameEn }} <span class="muted">{{ t.nameAr }}</span></h2>
            @if (t.careNotes) { <p>{{ t.careNotes }}</p> }
            @if (t.careSteps.length) { <h3>Care steps</h3><ol>@for (s of t.careSteps; track s) { <li>{{ s }}</li> }</ol> }
            @if (t.sunSchedule) { <h3>When to put it in the sun</h3><p>☀️ {{ t.sunSchedule }}</p> }
            @if (!t.careNotes && !t.careSteps.length && !t.sunSchedule) { <p class="muted">Detailed care steps for this plant are coming soon.</p> }
          </div>
          @if (req(); as r) {
            <div class="card">
              <h3>Ideal conditions</h3>
              <ul>
                <li>💧 Soil moisture {{ r.minMoisture }}–{{ r.maxMoisture }}%</li>
                <li>🌡️ Temperature {{ r.minTemperature }}–{{ r.maxTemperature }}°C</li>
                <li>☀️ Light {{ r.minLight }}–{{ r.maxLight }}%</li>
              </ul>
            </div>
          }
        </div>
      }
    </div>
  </div>`,
  styles: [`.layout{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:start;margin-top:1rem}.info{display:grid;gap:1rem}.preview{margin-top:.8rem;max-width:240px}.err{max-width:460px}`],
})
export class AddPlant {
  private svc = inject(PlantsService); private notes = inject(NotificationsService); private router = inject(Router);
  private route = inject(ActivatedRoute);
  types = signal<PlantType[]>([]); selectedId = signal('');
  type = signal<PlantType | null>(null); req = signal<PlantRequirement | null>(null);
  nickname = ''; photo = signal(''); photoError = signal('');
  error = signal(''); saveError = signal(''); saving = signal(false);
  categories = computed(() => [...new Set(this.types().map(t => t.category))]);

  constructor() { this.init(); }
  typesIn(c: string) { return this.types().filter(t => t.category === c); }

  init() {
    this.error.set('');
    this.svc.getPlantTypes().subscribe({
      next: list => {
        this.types.set(list);
        const pre = this.route.snapshot.params['id'] ?? this.route.snapshot.queryParamMap.get('type');
        if (pre) this.select(pre);
      },
      error: e => this.error.set(apiErrorMessage(e, 'Could not load the plants.')),
    });
  }

  select(id: string) {
    this.selectedId.set(id); this.type.set(null); this.req.set(null);
    this.svc.getPlantType(id).subscribe({
      next: r => { this.type.set(r.type); this.req.set(r.requirement); },
      error: e => this.error.set(e?.status === 404 ? 'This plant was not found.' : apiErrorMessage(e, 'Could not load this plant.')),
    });
  }

  onFile(ev: Event) {
    const f = (ev.target as HTMLInputElement).files?.[0];
    this.photoError.set(''); this.photo.set('');
    if (!f) return;
    if (!f.type.startsWith('image/')) { this.photoError.set('Please choose an image file.'); return; }
    if (f.size > 5 * 1024 * 1024) { this.photoError.set('The image is too big. Choose one under 5 MB.'); return; }
    const img = new Image(), url = URL.createObjectURL(f);
    img.onload = () => {            // shrink to max 600px so it stays light
      const k = Math.min(1, 600 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      this.photo.set(c.toDataURL('image/jpeg', 0.8)); URL.revokeObjectURL(url);
    };
    img.onerror = () => this.photoError.set('Could not read this image.');
    img.src = url;
  }

  save() {
    const t = this.type(); if (!t) return;
    this.saving.set(true); this.saveError.set('');
    this.svc.addPlant(t.id, this.nickname.trim() || t.nameEn, this.photo()).subscribe({
      next: () => { this.notes.load(); this.router.navigate(['/my-plants']); },
      error: e => { this.saving.set(false); this.saveError.set(apiErrorMessage(e, 'Could not save your plant.')); },
    });
  }
}
