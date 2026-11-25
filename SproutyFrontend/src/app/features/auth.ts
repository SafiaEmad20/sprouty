import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { apiErrorMessage } from '../core/api-error';
@Component({ selector:'app-auth', imports:[ReactiveFormsModule,RouterLink], template:`
  <section class="auth-page"><div class="auth-photo"><a routerLink="/" class="photo-brand"><span class="brand-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/><path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/></svg></span> SPROUTY</a><div class="photo-quote"><p class="eyebrow">A LITTLE ATTENTION GOES A LONG WAY</p><h2>Good things<br><em>grow with care.</em></h2><p>Understand what your plants need, one little moment at a time.</p></div></div><div class="auth-panel"><a routerLink="/" class="auth-brand"><span class="brand-symbol" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/><path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/></svg></span> SPROUTY</a><div class="auth-form"><p class="eyebrow">{{isRegister?'YOUR GARDEN STARTS HERE':'WELCOME BACK'}}</p><h1>{{isRegister?'Start growing.':'Hello again.'}}</h1><p class="muted">{{isRegister?'Create an account and give your plants the care they deserve.':'It’s lovely to see you again. Your plants missed you.'}}</p>
    <form [formGroup]="form" (ngSubmit)="submit()">@if(isRegister){<label for="name">Your name</label><input id="name" formControlName="name" autocomplete="name" placeholder="Your name">@if(touched('name')){<small class="error">Enter at least 2 characters.</small>}}
    <label for="email">Email address</label><input id="email" type="email" formControlName="email" autocomplete="email" placeholder="you@example.com">@if(touched('email')){<small class="error">Enter a valid email address.</small>}
    <label for="password">Password</label><input id="password" [type]="show()?'text':'password'" formControlName="password" [autocomplete]="isRegister?'new-password':'current-password'" placeholder="At least 8 characters">@if(touched('password')){<small class="error">Password must be at least 8 characters.</small>}
    @if(!isRegister){<div class="forgot-row"><a routerLink="/forgot-password">Forgot password?</a></div>}
    @if(failed()){<p class="error">{{failed()}}</p>}<button class="btn-primary auth-submit" [disabled]="loading()">{{loading()?'Please wait…':isRegister?'Create my account':'Log in'}}</button></form>
    <p class="auth-switch">{{isRegister?'Already have an account?':'New to Sprouty?'}} <a [routerLink]="isRegister?'/login':'/register'">{{isRegister?'Log in':'Create an account'}}</a></p><p class="auth-legal">By continuing, you agree to grow with a little more care.</p></div></div></section>`,
})
export class AuthPage {
  private fb=inject(FormBuilder);private auth=inject(AuthService);private router=inject(Router);private route=inject(ActivatedRoute);
  isRegister=this.route.snapshot.data['mode']==='register';show=signal(false);loading=signal(false);failed=signal('');
  form=this.fb.nonNullable.group({name:[''],email:['',[Validators.required,Validators.email]],password:['',[Validators.required,Validators.minLength(8)]]});
  constructor(){if(this.isRegister)this.form.controls.name.addValidators([Validators.required,Validators.minLength(2)]);}
  touched(c:'name'|'email'|'password'){const x=this.form.controls[c];return x.invalid&&(x.dirty||x.touched);}
  submit(){this.form.markAllAsTouched();if(this.form.invalid)return;const{name,email,password}=this.form.getRawValue();this.loading.set(true);this.failed.set('');const req=this.isRegister?this.auth.register(name,email,password):this.auth.login(email,password);req.subscribe({next:()=>this.router.navigate(['/my-plants']),error:e=>{this.loading.set(false);this.failed.set(apiErrorMessage(e,'Could not sign you in. Check your details and try again.'));}});}
}
