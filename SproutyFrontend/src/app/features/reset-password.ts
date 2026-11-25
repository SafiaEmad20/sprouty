import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { apiErrorMessage } from '../core/api-error';

@Component({
  selector: 'app-reset-password', imports: [ReactiveFormsModule, RouterLink],
  template: `<section class="auth-page"><div class="auth-photo"><span>A little attention<br>goes a long way.</span></div><div class="auth-panel"><a routerLink="/" class="auth-brand"><span class="brand-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/><path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/></svg></span> SPROUTY</a><div class="auth-form"><p class="eyebrow">One last step</p><h1>Reset password</h1><p class="muted">Choose a new password for your Sprouty account.</p>
    <form [formGroup]="form" (ngSubmit)="submit()"><label for="password">New password</label><input id="password" type="password" formControlName="newPassword" autocomplete="new-password"><label for="confirm">Confirm password</label><input id="confirm" type="password" formControlName="confirmPassword" autocomplete="new-password">
    @if(error()){<p class="error">{{error()}}</p>} @if(success()){<p class="success">{{success()}}</p>}
    <button class="btn-primary auth-submit" type="submit" [disabled]="loading() || !token || !email">{{loading() ? 'Updating…' : 'Update password'}}</button></form><a routerLink="/login" class="back-link">← Back to log in</a></div></div></section>`,
})
export class ResetPassword {
  private fb = inject(FormBuilder); private auth = inject(AuthService); private route = inject(ActivatedRoute); private router = inject(Router);
  token = this.route.snapshot.queryParamMap.get('token') ?? ''; email = this.route.snapshot.queryParamMap.get('email') ?? '';
  form = this.fb.nonNullable.group({ newPassword: ['', [Validators.required, Validators.minLength(8)]], confirmPassword: ['', [Validators.required, Validators.minLength(8)]] });
  loading = signal(false); error = signal(''); success = signal('');
  submit() { this.form.markAllAsTouched(); if (!this.token || !this.email) { this.error.set('This reset link is incomplete. Request a new one.'); return; }
    if (this.form.invalid) return; const v = this.form.getRawValue(); if (v.newPassword !== v.confirmPassword) { this.error.set('The passwords do not match.'); return; }
    this.loading.set(true); this.error.set(''); this.auth.resetPassword(this.email, this.token, v.newPassword, v.confirmPassword).subscribe({ next: () => { this.success.set('Your password has been updated. You can now log in.'); this.loading.set(false); setTimeout(() => this.router.navigate(['/login']), 1400); }, error: e => { this.error.set(apiErrorMessage(e, 'This reset link may have expired. Request a new one.')); this.loading.set(false); } });
  }
}
