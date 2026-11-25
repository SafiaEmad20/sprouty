import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlantsService } from '../services/plants.service';
import { apiErrorMessage } from '../core/api-error';
import { PlantRequirement, PlantType } from '../models';
import { plantPhoto } from '../core/plant-images';

@Component({
  selector: 'app-add-plant',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="container add-plant-page">
      <a routerLink="/my-plants" class="back-link">← Back to my plants</a>
      <section class="add-plant-hero">
        <div class="add-plant-hero-copy"><p class="eyebrow">A NEW LEAF, A NEW BEGINNING</p>
          <h1>Find a place for<br><em>something green.</em></h1>
          <p>Choose a plant you love. We'll help you understand what it needs to thrive.</p>
          <div class="add-plant-trust"><span>01&nbsp; Choose your plant</span><span>02&nbsp; Make it yours</span></div>
        </div>
        <div class="add-plant-hero-image"><img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=90" alt="Sunlit indoor plants with lush green leaves"></div>
      </section>
      <p class="muted add-intro">Choose your plant, give it a name, and add a photo to make its place in your garden feel personal.</p>

      <div class="stepper" aria-label="Add plant steps">
        <div [class.current]="step()===1" [class.done]="step()>1"><span>1</span><div><b>Choose a plant</b><small>Find your green friend</small></div></div>
        <i></i>
        <div [class.current]="step()===2"><span>2</span><div><b>Make it yours</b><small>Name and photo</small></div></div>
      </div>

      @if (error()) { <p class="error">{{ error() }}</p> }

      @if (step() === 1) {
        <section class="card wizard-card">
          <div class="wizard-heading"><div><p class="eyebrow">THE PLANT LIBRARY</p><h2>Which plant are we adding?</h2><p class="muted">Explore the collection and choose the one you have at home.</p></div><span class="plant-count">{{ filteredTypes().length }} plants</span></div>
          <label for="plant-search">Find your plant</label>
          <div class="plant-search-wrap"><span class="search-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></span><input id="plant-search" class="plant-search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Search by name or plant type…"></div>
          <p class="selection-hint">Choose a plant to see its photo and care preferences.</p>
          <div class="plant-choice-grid">
            @for (t of filteredTypes(); track t.id) {
              <button type="button" class="plant-choice" [class.chosen]="selectedId()===t.id" (click)="select(t)">
                <img [src]="t.imageUrl || fallbackPhoto(t)" [alt]="t.nameEn" loading="lazy">
                <span class="plant-choice-copy"><b>{{ t.nameEn }}</b><small>{{ t.nameAr }} · {{ t.category }}</small></span>
                <span class="choice-check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg></span>
              </button>
            } @empty {
              <p class="muted plant-empty">No plants match that search. Try another name.</p>
            }
          </div>
          <div class="wizard-footer"><span class="muted">{{ selected()?.nameEn || 'Choose a plant to continue' }}</span><button class="btn-primary" type="button" [disabled]="!selected()" (click)="step.set(2)">Continue <span aria-hidden="true">→</span></button></div>
        </section>
      }

      @if (step() === 2 && selected(); as t) {
        <section class="card wizard-card personalize-card">
          <div class="personalize-layout">
            <div class="personalize-main">
              <div class="wizard-heading"><div><p class="eyebrow">A LITTLE PERSONAL TOUCH</p><h2>Make it feel like yours.</h2><p class="muted">Give your plant a name and choose the photo you'd like to see in your garden.</p></div></div>
              <label for="nickname">Plant name</label>
              <input id="nickname" [(ngModel)]="nickname" [placeholder]="t.nameEn">
              <div class="photo-field-heading"><label for="image-url">Plant photo</label><span class="muted">Optional</span></div>
              <div class="photo-preview">
                <img [src]="imageUrl.trim() || t.imageUrl || fallbackPhoto(t)" [alt]="nickname || t.nameEn">
                <div><b>{{ nickname.trim() || t.nameEn }}</b><small>{{ t.nameEn }} · {{ t.category }}</small></div>
              </div>
              <label for="image-url">Paste an image link</label>
              <input id="image-url" type="url" [(ngModel)]="imageUrl" placeholder="https://example.com/your-plant.jpg">
              <small class="muted image-help">Use a direct public image link (https://), or choose one of the curated photos below. Image upload from your device needs a backend upload service.</small>
              <div class="photo-options-heading"><b>Choose a look for your plant</b><small class="muted">Select a natural photo. You can also paste a direct image URL above.</small></div>
              <div class="photo-options">
                @for (photo of photoOptions; track photo.url) {
                  <button type="button" [class.selected]="imageUrl===photo.url" (click)="selectPhoto(photo.url)" [attr.aria-label]="'Choose ' + photo.label">
                    <img [src]="photo.url" [alt]="photo.label" loading="lazy"><span>{{ photo.label }}</span>
                  </button>
                }
                @if (t.imageUrl) {
                  <button type="button" [class.selected]="imageUrl===t.imageUrl" (click)="selectPhoto(t.imageUrl)" aria-label="Use library plant photo">
                    <img [src]="t.imageUrl" [alt]="t.nameEn" loading="lazy"><span>Library photo</span>
                  </button>
                }
              </div>
            </div>
            <aside class="plant-preview-panel">
              <div class="preview-panel-top"><p class="eyebrow">A PREVIEW OF YOUR GARDEN</p><span class="preview-live-dot">LIVE PREVIEW</span></div>
              <img [src]="imageUrl.trim() || t.imageUrl || fallbackPhoto(t)" [alt]="nickname || t.nameEn">
              <h3>{{ nickname.trim() || t.nameEn }}</h3><p class="muted">{{ t.nameEn }} · {{ t.category }}</p><p class="preview-caption">A little green companion, ready to grow with you.</p>
              @if (req(); as r) {
                <div class="ideal-box"><b>Care preferences</b><div><span>Soil moisture</span><strong>{{ r.minMoisture }}–{{ r.maxMoisture }}%</strong></div><div><span>Temperature</span><strong>{{ r.minTemperature }}–{{ r.maxTemperature }}°C</strong></div><div><span>Air humidity</span><strong>{{ r.minHumidity }}–{{ r.maxHumidity }}%</strong></div><div><span>Light</span><strong>{{ r.minLight }}–{{ r.maxLight }}%</strong></div></div>
              }
            </aside>
          </div>
          @if (saveError()) { <p class="error">{{ saveError() }}</p> }
          <div class="wizard-footer"><button class="btn-outline" type="button" (click)="step.set(1)">← Back</button><button class="btn-primary" type="button" [disabled]="saving()" (click)="save()">{{ saving() ? 'Adding your plant…' : 'Add to my garden' }}</button></div>
        </section>
      }
    </div>
  `,
})
export class AddPlant {
  private svc = inject(PlantsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly photoOptions = [
    { label: 'Sunlit leaves', url: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85' },
    { label: 'Monstera', url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=85' },
    { label: 'Green corner', url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85' },
    { label: 'Indoor garden', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85' },
  ];

  types = signal<PlantType[]>([]);
  selectedId = signal('');
  selected = signal<PlantType | null>(null);
  req = signal<PlantRequirement | null>(null);
  step = signal(1);
  query = signal('');
  nickname = '';
  imageUrl = '';
  error = signal('');
  saveError = signal('');
  saving = signal(false);

  filteredTypes = computed(() =>
    this.types().filter(t => (t.nameEn + ' ' + t.nameAr + ' ' + t.category).toLowerCase().includes(this.query().toLowerCase())),
  );

  constructor() {
    this.svc.getPlantTypes().subscribe({
      next: list => {
        this.types.set(list);
        const id = this.route.snapshot.params['id'] ?? this.route.snapshot.queryParamMap.get('type');
        if (id) {
          const found = list.find(x => x.id === id);
          if (found) this.select(found);
        }
      },
      error: e => this.error.set(apiErrorMessage(e, 'Could not load the plant library.')),
    });
  }

  fallbackPhoto(type: PlantType) { return plantPhoto(type); }

  selectPhoto(url: string) { this.imageUrl = url; }

  select(t: PlantType) {
    this.selectedId.set(t.id);
    this.selected.set(t);
    this.imageUrl = t.imageUrl || '';
    this.nickname = '';
    this.svc.getPlantType(t.id).subscribe({
      next: r => this.req.set(r.requirement),
      error: e => this.error.set(apiErrorMessage(e)),
    });
  }

  save() {
    const t = this.selected();
    if (!t) return;
    const url = this.imageUrl.trim();
    if (url && (!/^https?:\/\//i.test(url) || url.length > 500)) {
      this.saveError.set('Please enter a valid image URL (up to 500 characters).');
      return;
    }
    this.saving.set(true);
    this.saveError.set('');
    this.svc.addPlant(t.id, this.nickname.trim() || t.nameEn, url).subscribe({
      next: p => this.router.navigate(['/dashboard', p.id]),
      error: e => {
        this.saveError.set(apiErrorMessage(e, 'Could not add this plant.'));
        this.saving.set(false);
      },
    });
  }
}
