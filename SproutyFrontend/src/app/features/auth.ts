import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { apiErrorMessage } from '../core/api-error';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
  <div class="container wrap">
    <div class="card box">
      <h1>{{ isRegister ? 'Create your account' : 'Welcome back' }}</h1>
      <p class="muted">{{ isRegister ? 'Add your plants and let them tell you what they need.' : 'Log in to check on your plants.' }}</p>
      <form [formGroup]="form" (ngSubmit)="submit()">
        @if (isRegister) {
          <label for="name">Name</label>
          <input id="name" formControlName="name" autocomplete="name">
          @if (touched('name')) { <p class="error">Enter your name (at least 2 characters).</p> }
        }
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" autocomplete="email">
        @if (touched('email')) { <p class="error">Enter a valid email address.</p> }
        <label for="password">Password</label>
        <div class="pw">
          <input id="password" [type]="show() ? 'text' : 'password'" formControlName="password" autocomplete="current-password">
          <button type="button" class="eye" (click)="show.set(!show())" [attr.aria-label]="show() ? 'Hide password' : 'Show password'" [attr.aria-pressed]="show()">{{ show() ? 'Hide' : 'Show' }}</button>
        </div>
        @if (touched('password')) { <p class="error">Password must be at least 8 characters.</p> }
        @if (failed()) { <p class="error">{{ failed() }}</p> }
        <p><button class="btn" [disabled]="loading()">{{ isRegister ? 'Create account' : 'Log in' }}</button></p>
      </form>
      <p class="muted">
        @if (isRegister) { Already have an account? <a routerLink="/login">Log in</a> }
        @else { New here? <a routerLink="/register">Create an account</a> }
      </p>
    </div>
  </div>`,
  styles: [`.wrap{display:grid;place-items:center;padding-top:3rem}.box{width:100%;max-width:420px}.pw{position:relative}.pw input{padding-right:4.5rem}.eye{position:absolute;right:.4rem;top:50%;transform:translateY(-50%);border:0;background:none;color:var(--leaf-dark);font:700 .9rem var(--font-body);cursor:pointer;padding:.4rem .6rem}`],
})
export class AuthPage {
  private fb = inject(FormBuilder); private auth = inject(AuthService); private router = inject(Router);
  isRegister = inject(ActivatedRoute).snapshot.data['mode'] === 'register';
  show = signal(false); loading = signal(false); failed = signal('');
  form = this.fb.nonNullable.group({
    name: [''], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]],
  });
  constructor() { if (this.isRegister) this.form.controls.name.addValidators([Validators.required, Validators.minLength(2)]); }
  touched(c: 'name' | 'email' | 'password') { const x = this.form.controls[c]; return x.invalid && (x.dirty || x.touched); }

  submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const { name, email, password } = this.form.getRawValue();
    this.loading.set(true); this.failed.set('');
    const req$ = this.isRegister ? this.auth.register(name, email, password) : this.auth.login(email, password);
    req$.subscribe({
      next: () => this.router.navigate(['/my-plants']),
      error: e => { this.loading.set(false); this.failed.set(apiErrorMessage(e, 'Could not sign you in. Check your details and try again.')); },
    });
  }
}
