import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantsService } from '../services/plants.service';
import { apiErrorMessage } from '../core/api-error';
import { PlantType } from '../models';

@Component({
  selector: 'app-edit-plant', imports: [ReactiveFormsModule, RouterLink],
  template: `<div class="container edit-page"><a routerLink="/my-plants" class="back-link">← Back to my plants</a><p class="eyebrow">A little refresh</p><h1>Edit your plant</h1><p class="muted">Update its name or plant type. Your sensor stays connected.</p>
    @if(loading()){<p class="muted">Loading plant…</p>} @else {<form class="card edit-card" [formGroup]="form" (ngSubmit)="save()"><label for="nickname">Plant nickname</label><input id="nickname" formControlName="nickname"><label for="type">Plant type</label><select id="type" formControlName="plantTypeId">@for(t of types(); track t.id){<option [value]="t.id">{{t.nameEn}} · {{t.nameAr}}</option>}</select><label for="image">Image URL (optional)</label><input id="image" formControlName="imageUrl" placeholder="https://…">@if(error()){<p class="error">{{error()}}</p>}<div class="actions"><button class="btn-primary" [disabled]="saving()">{{saving()?'Saving…':'Save changes'}}</button><a class="btn-outline" routerLink="/my-plants">Cancel</a></div></form>}
  </div>`,
})
export class EditPlant {
  private fb = inject(FormBuilder); private svc = inject(PlantsService); private route = inject(ActivatedRoute); private router = inject(Router);
  id = this.route.snapshot.params['id']; types = signal<PlantType[]>([]); loading = signal(true); saving = signal(false); error = signal('');
  form = this.fb.nonNullable.group({ nickname: ['', [Validators.required, Validators.minLength(2)]], plantTypeId: ['', Validators.required], imageUrl: [''] });
  constructor() { this.svc.getPlantTypes().subscribe({ next: t => this.types.set(t), error: e => this.error.set(apiErrorMessage(e)) }); this.svc.getPlant(this.id).subscribe({ next: p => { this.form.patchValue({ nickname: p.nickname, plantTypeId: p.plantTypeId, imageUrl: p.imageUrl ?? '' }); this.loading.set(false); }, error: e => { this.error.set(apiErrorMessage(e, 'Could not load this plant.')); this.loading.set(false); } }); }
  save() { this.form.markAllAsTouched(); if (this.form.invalid) return; this.saving.set(true); this.error.set(''); const v = this.form.getRawValue(); const image=v.imageUrl.trim(); if(image && (!/^https?:\/\//i.test(image) || image.length>500)){this.error.set('Please enter a valid public image URL (up to 500 characters).');this.saving.set(false);return;} this.svc.updatePlant(this.id, v.plantTypeId, v.nickname.trim(), image).subscribe({ next: () => this.router.navigate(['/dashboard', this.id]), error: e => { this.error.set(apiErrorMessage(e, 'Could not update this plant.')); this.saving.set(false); } }); }
}
