import { Component, ElementRef, HostListener, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PlantsService } from '../services/plants.service';
import { Plant, PlantStatus, PlantType } from '../models';

interface Row { plant: Plant; type?: PlantType; status?: PlantStatus; }

@Component({
  selector: 'app-my-plants',
  imports: [RouterLink, FormsModule],
  template: `
  <div class="container">
    <div class="head"><h1>My plants</h1>
      <button class="btn" (click)="openForm()" [attr.aria-expanded]="showAdd()">+ Add plant</button>
    </div>

    @if (showAdd()) {
      <div class="card addbox">
        <h2>Add a new plant</h2>
        <label for="type">Plant type</label>
        <select id="type" [(ngModel)]="newType">
          @for (c of categories(); track c) {
            <optgroup [label]="c">
              @for (t of typesIn(c); track t.id) { <option [value]="t.id">{{ t.emoji }} {{ t.nameEn }} ({{ t.nameAr }})</option> }
            </optgroup>
          }
        </select>
        <label for="nick">Nickname (optional)</label>
        <input id="nick" [(ngModel)]="newNick" placeholder="e.g. Bassil">
        <label for="photo">Photo of your plant (optional)</label>
        <input id="photo" type="file" accept="image/*" (change)="onFile($event)">
        @if (photoError()) { <p class="error">{{ photoError() }}</p> }
        <div class="preview">
          @if (photo()) { <img class="photo" [src]="photo()" alt="Preview of your plant"> }
          @else { <div class="thumb">{{ selectedType()?.emoji }}</div><p class="muted">No photo? We’ll show a picture for this plant type instead.</p> }
        </div>
        <div class="actions"><button class="btn" (click)="save()">Save plant</button>
          <button class="btn ghost" (click)="showAdd.set(false)">Cancel</button></div>
        <p class="muted">Not sure what to pick? <a routerLink="/plants">See care guides in the library</a>.</p>
      </div>
    }

    <div class="grid">
      @for (r of rows(); track r.plant.id) {
        <div class="card">
          @if (r.plant.imageUrl) { <img class="photo" [src]="r.plant.imageUrl" [alt]="r.plant.nickname"> }
          @else { <div class="thumb">{{ r.type?.emoji }}</div> }
          <h2>{{ r.plant.nickname }}</h2><p class="muted">{{ r.type?.nameEn }}</p>
          @if (r.status; as s) {
            <p>“{{ s.message }}”</p>
            <span class="badge" [class]="s.statusType === 'Healthy' ? 'ok' : 'bad'">{{ s.statusType === 'Healthy' ? 'Healthy' : 'Needs attention' }}</span>
          }
          <div class="actions">
            <a class="btn" [routerLink]="['/dashboard', r.plant.id]">Open dashboard</a>
            <button class="btn ghost" (click)="confirmId.set(r.plant.id)">Remove</button>
          </div>
        </div>
      } @empty { <p class="muted">You have no plants yet. Tap “Add plant” to start.</p> }
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
  styles: [`.head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}.addbox{max-width:460px;margin:1rem 0}.preview{margin-top:.8rem;max-width:240px}`],
})
export class MyPlants {
  private svc = inject(PlantsService);
  rows = signal<Row[]>([]); types = signal<PlantType[]>([]);
  showAdd = signal(false); newType = ''; newNick = '';
  photo = signal(''); photoError = signal('');
  confirmId = signal<string | null>(null);
  keepBtn = viewChild<ElementRef<HTMLButtonElement>>('keep');
  categories = computed(() => [...new Set(this.types().map(t => t.category))]);
  confirmRow = computed(() => this.rows().find(r => r.plant.id === this.confirmId()));

  constructor() { this.load(); effect(() => this.keepBtn()?.nativeElement.focus()); }
  @HostListener('document:keydown.escape') onEsc() { this.confirmId.set(null); }

  typesIn(c: string) { return this.types().filter(t => t.category === c); }
  selectedType() { return this.types().find(t => t.id === this.newType); }
  openForm() { this.newType = this.types()[0]?.id ?? ''; this.newNick = ''; this.photo.set(''); this.photoError.set(''); this.showAdd.set(true); }

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
    const t = this.selectedType(); if (!t) return;
    this.svc.addPlant(t.id, this.newNick.trim() || t.nameEn, this.photo()).subscribe(() => { this.showAdd.set(false); this.load(); });
  }
  confirmRemove() { const id = this.confirmId(); if (id) this.svc.deletePlant(id).subscribe(() => { this.confirmId.set(null); this.load(); }); }

  load() {
    forkJoin([this.svc.getMyPlants(), this.svc.getPlantTypes()]).subscribe(([plants, types]) => {
      this.types.set(types);
      this.rows.set(plants.map(plant => ({ plant, type: types.find(t => t.id === plant.plantTypeId) })));
      this.rows().forEach(row => this.svc.getLatest(row.plant.id).subscribe(l => this.rows.update(a => a.map(x => x.plant.id === row.plant.id ? { ...x, status: l.status } : x))));
    });
  }
}
