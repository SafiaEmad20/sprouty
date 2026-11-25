import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantsService } from '../services/plants.service';
import { apiErrorMessage } from '../core/api-error';

@Component({ selector: 'app-readings-form', imports: [ReactiveFormsModule, RouterLink], template: `
  <div class="container form-page"><a [routerLink]="['/dashboard', id]" class="back-link">← Back to plant</a><p class="eyebrow">A little check-in</p><h1>Add a manual reading</h1><p class="muted">Enter the latest values from your sensor.</p>
    <form class="card reading-form" [formGroup]="form" (ngSubmit)="save()">
      <div class="reading-fields"><div><label for="moisture">Soil moisture</label><div class="input-unit"><input id="moisture" type="number" formControlName="moisture" min="0" max="100"><span>%</span></div></div>
      <div><label for="temperature">Temperature</label><div class="input-unit"><input id="temperature" type="number" formControlName="temperature" min="-10" max="60" step="0.1"><span>°C</span></div></div>
      <div><label for="humidity">Air humidity</label><div class="input-unit"><input id="humidity" type="number" formControlName="humidity" min="0" max="100"><span>%</span></div></div>
      <div><label for="light">Light level</label><div class="input-unit"><input id="light" type="number" formControlName="light" min="0" max="100"><span>%</span></div></div></div>
      @if(error()){<p class="error">{{error()}}</p>} @if(saved()){<p class="success">Reading saved successfully.</p>}
      <button class="btn-primary" [disabled]="saving()">{{saving()?'Saving…':'Save reading'}}</button>
    </form>
  </div>`,
})
export class ReadingsForm {
  private svc = inject(PlantsService); private fb = inject(FormBuilder); private router = inject(Router);
  id = inject(ActivatedRoute).snapshot.params['id']; saved = signal(false); saving = signal(false); error = signal('');
  form = this.fb.group({ moisture: [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]], temperature: [null as number | null, [Validators.required, Validators.min(-10), Validators.max(60)]], humidity: [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]], light: [null as number | null, [Validators.required, Validators.min(0), Validators.max(100)]] });
  save() { this.form.markAllAsTouched(); if (this.form.invalid) return; this.saving.set(true); this.error.set(''); const v=this.form.getRawValue(); this.svc.addReading(this.id, {moisture:Number(v.moisture),temperature:Number(v.temperature),humidity:Number(v.humidity),light:Number(v.light)}).subscribe({ next: () => { this.saved.set(true); this.router.navigate(['/dashboard', this.id]); }, error: e => { this.error.set(apiErrorMessage(e, 'Could not save this reading. Check the values and sensor connection.')); this.saving.set(false); } }); }
}
