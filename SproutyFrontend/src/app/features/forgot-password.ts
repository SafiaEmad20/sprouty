import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { apiErrorMessage } from '../core/api-error';

@Component({
  selector: 'app-forgot-password', imports: [ReactiveFormsModule, RouterLink],
  template: `<section class="auth-page auth-recovery-page"><div class="auth-photo recovery-photo"><a routerLink="/" class="photo-brand"><span class="brand-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/><path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/></svg></span> SPROUTY</a><div class="recovery-photo-copy"><p class="eyebrow">A GENTLER WAY TO GROW</p><h2>Every new beginning<br>needs a little <em>care.</em></h2><p>Your garden will be right where you left it.</p></div></div><div class="auth-panel recovery-panel"><div class="auth-form recovery-form"><a routerLink="/" class="auth-brand"><span class="brand-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/><path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/></svg></span> SPROUTY</a><p class="eyebrow">ACCOUNT RECOVERY</p><h1>Forgot your password?</h1><p class="muted recovery-description">It happens. Enter the email address connected to your account and, if it exists, we'll send you a secure link to choose a new password.</p>
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate><label for="email">Email address</label><input id="email" type="email" formControlName="email" autocomplete="email" placeholder="you@example.com" [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched">@if(form.controls.email.invalid && form.controls.email.touched){<small class="error">Please enter a valid email address.</small>}
    @if(error()){<p class="error" role="alert">{{error()}}</p>} @if(success()){<p class="success" role="status">{{success()}}</p>}
    <button class="btn-primary auth-submit recovery-submit" type="submit" [disabled]="loading() || form.invalid">{{loading() ? 'Sending your link…' : 'Send password reset link'}} <span aria-hidden="true">→</span></button></form><a routerLink="/login" class="back-link recovery-back"><span aria-hidden="true">←</span> Back to log in</a><p class="recovery-footnote">For your security, we won't reveal whether an email address has an account.</p></div></div></section>`,
})
export class ForgotPassword {
  private fb = inject(FormBuilder); private auth = inject(AuthService);
  form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]] });
  loading = signal(false); error = signal(''); success = signal('');
  submit() { this.form.markAllAsTouched(); if (this.form.invalid) return; this.loading.set(true); this.error.set(''); this.success.set('');
    this.auth.forgotPassword(this.form.controls.email.value).subscribe({ next: r => { this.success.set(r.message || 'If an account exists, a reset link has been sent.'); this.loading.set(false); }, error: e => { this.error.set(apiErrorMessage(e)); this.loading.set(false); } });
  }
}
