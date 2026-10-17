import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PlantsService } from '../services/plants.service';

@Component({
  selector: 'app-readings-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
  <div class="container"><a [routerLink]="['/dashboard', id]">← Back to dashboard</a>
    <div class="card box"><h1>Enter a reading</h1>
      <form [formGroup]="form" (ngSubmit)="save()">
        @for (f of fields; track f.key) {
          <label [for]="f.key">{{ f.label }}</label>
          <input [id]="f.key" type="number" step="0.1" [formControlName]="f.key">
          @if (form.get(f.key)?.invalid && form.get(f.key)?.touched) { <p class="error">Enter a number from {{ f.min }} to {{ f.max }}.</p> }
        }
        @if (saved()) { <p class="badge ok">Reading saved</p> }
        <p><button class="btn">Save reading</button></p>
      </form></div></div>`,
  styles: [`.box{max-width:420px;margin-top:1rem}`],
})
export class ReadingsForm {
  private svc = inject(PlantsService); private fb = inject(FormBuilder);
  id = inject(ActivatedRoute).snapshot.params['id']; saved = signal(false);
  fields = [
    { key: 'moisture', label: 'Soil moisture (%)', min: 0, max: 100 }, { key: 'temperature', label: 'Temperature (°C)', min: -10, max: 60 },  { key: 'light', label: 'Light (%)', min: 0, max: 100 }] as const;
  form = this.fb.nonNullable.group(Object.fromEntries(this.fields.map(f => [f.key, [null as number | null, [Validators.required, Validators.min(f.min), Validators.max(f.max)]]])));
  save() {
    this.form.markAllAsTouched(); if (this.form.invalid) return;
    const v = this.form.getRawValue() as any;
    this.svc.addReading({ plantId: this.id, moisture: v.moisture, temperature: v.temperature, light: v.light }).subscribe(() => { this.saved.set(true); this.form.reset(); });
  }
}
