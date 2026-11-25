import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  template: `
    <div class="container account-page">
      <p class="eyebrow">YOUR ACCOUNT</p>
      <div class="section-heading">
        <div><h1>Your profile.</h1><p class="muted">The details connected to your Sprouty account.</p></div>
      </div>
      @if (auth.user(); as user) {
        <section class="card profile-card">
          <div class="profile-cover"></div>
          <div class="profile-main">
            <div class="profile-large-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
            <div><h2>{{ user.name }}</h2><p class="muted">Sprouty member</p></div>
          </div>
          <div class="profile-details">
            <div><span>Full name</span><b>{{ user.name }}</b></div>
            <div><span>Email address</span><b>{{ user.email }}</b></div>
            <div><span>Account role</span><b>{{ user.role || 'User' }}</b></div>
          </div>
          <p class="account-note">Your profile details are currently read from your signed-in account. Editing account details will be enabled when the backend provides a profile-update endpoint.</p>
          <div class="actions"><a class="btn-outline" routerLink="/settings">Account settings</a></div>
        </section>
      } @else {
        <div class="card"><p class="muted">No signed-in account was found.</p><a class="btn-primary" routerLink="/login">Log in</a></div>
      }
    </div>
  `,
})
export class Profile {
  auth = inject(AuthService);
}
