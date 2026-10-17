import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Reveal } from '../shared/reveal';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Reveal],
  template: `
  <section class="hero">
    <span class="leaf l1" aria-hidden="true">🍃</span><span class="leaf l2" aria-hidden="true">🌿</span><span class="leaf l3" aria-hidden="true">🍃</span>
    <div class="hero-in">
      <div class="copy">
        <p class="eyebrow">From seed to need</p>
        <h1>Your plants can finally tell you what they need.</h1>
        <p class="sub">Sprouty turns sensor numbers into simple, friendly messages, so you always know when to water, move or rescue your plant.</p>
        <div class="cta">
          <a class="btn big" [routerLink]="auth.isLoggedIn ? '/my-plants' : '/register'">{{ auth.isLoggedIn ? 'Go to my plants' : 'Get started' }}</a>
          <button class="btn big ghost light" (click)="scrollToFeatures()">See what it can do</button>
        </div>
      </div>
      <div class="bubble-demo" aria-live="polite">
        <div class="plant" aria-hidden="true">🪴</div>
        <div class="say" [class.swap]="swap()"><span>{{ messages[i()].icon }}</span> {{ messages[i()].text }}</div>
      </div>
    </div>
  </section>

  <section id="features" class="features">
    <div class="container">
      <h2 reveal>What Sprouty can do for you</h2>
      <div class="flist">
        @for (f of features; track f.n; let k = $index) {
          <div reveal [revealDelay]="k * 120"><div class="feat"><span class="num">{{ f.n }}</span><h3>{{ f.t }}</h3><p>{{ f.d }}</p></div></div>
        }
      </div>
    </div>
  </section>

  <section class="final container" reveal>
    <h2>Ready to keep your plant alive?</h2>
    <p class="muted">Pick an easy plant, add it to your list and let it talk to you.</p>
    <a class="btn big" [routerLink]="auth.isLoggedIn ? '/plants' : '/register'">{{ auth.isLoggedIn ? 'Browse the plant library' : 'Create a free account' }}</a>
  </section>`,
  styles: [`
    .hero{position:relative;overflow:hidden;color:#fff;min-height:78vh;display:grid;align-items:center;
      background:linear-gradient(100deg,rgba(52,66,45,.88) 20%,rgba(52,66,45,.35)),url('/images/hero.jpg') center/cover,url('/images/hero.svg') center/cover,#3F5238}
    .hero-in{position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:3rem 1.2rem;display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));align-items:center}
    .eyebrow{color:var(--peach);font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:0 0 .5rem;animation:rise .7s both}
    h1{font-size:clamp(2.2rem,5vw,3.6rem);animation:rise .7s .1s both}
    .sub{font-size:1.15rem;max-width:34rem;color:#F4F1C8;animation:rise .7s .25s both}
    .cta{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.4rem;animation:rise .7s .4s both}
    .big{padding:.8rem 1.6rem;font-size:1.1rem}
    .btn.light{color:#fff;border-color:#fff}.btn.light:hover{background:rgba(255,255,255,.15)}
    .bubble-demo{display:grid;justify-items:center;gap:.5rem;animation:rise .8s .3s both}
    .plant{font-size:7rem;animation:bob 4s ease-in-out infinite}
    .say{background:#fff;color:var(--ink);font:700 1.3rem var(--font-head);padding:.9rem 1.4rem;border-radius:24px 24px 24px 4px;box-shadow:0 12px 30px rgba(0,0,0,.25);transition:opacity .35s,transform .35s;min-width:16rem;text-align:center}
    .say.swap{opacity:0;transform:translateY(6px)}
    .leaf{position:absolute;font-size:2.4rem;opacity:.7;animation:drift 9s ease-in-out infinite}
    .l1{left:6%;top:14%}.l2{left:44%;bottom:10%;animation-delay:-3s}.l3{right:8%;top:10%;animation-delay:-6s}
    .features{background:var(--leaf);color:#fff;padding:3.5rem 0}
    .features h2{font-size:2rem;text-align:center;margin-bottom:2rem}
    .flist{display:grid;gap:1.2rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
    .feat{height:100%;padding:1rem 1rem 1.2rem;border-top:3px solid rgba(253,251,212,.45);transition:transform .25s,border-color .25s}
    .feat:hover{transform:translateY(-6px);border-color:var(--peach)}
    .num{font:700 2.4rem var(--font-head);color:var(--peach)}.feat h3{font-size:1.2rem}.feat p{color:#F4F1C8;margin:0}
    .final{text-align:center;padding-top:3rem}
    @keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
    @keyframes bob{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-14px) rotate(2deg)}}
    @keyframes drift{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(18px,-22px) rotate(25deg)}}
  `],
})
export class Home {
  auth = inject(AuthService);
  messages = [
    { icon: '💧', text: "I'm a little thirsty." }, { icon: '🌡️', text: "It's too hot for me!" },
    { icon: '☀️', text: 'Could I get some sun?' }, { icon: '💚', text: 'I feel great, thank you!' }];
  i = signal(0); swap = signal(false);
  features = [
    { n: '01', t: 'Plants that talk', d: 'No more guessing. Sprouty turns raw numbers into friendly messages like “I’m a little thirsty.”' },
    { n: '02', t: 'Live readings', d: 'Watch soil moisture, light and temperature, compared with your plant’s ideal range.' },
    { n: '03', t: 'Urgent alerts', d: 'Get notified the moment something needs attention, before a bad day becomes a dead plant.' },
    { n: '04', t: 'Sun schedule', d: 'Know when to put your plant in the sun and when to take it back in.' },
    { n: '05', t: 'Beginner guides', d: 'Simple care steps for easy herbs, succulents and flowers.' }];
  constructor() {
    const id = setInterval(() => { this.swap.set(true); setTimeout(() => { this.i.update(v => (v + 1) % this.messages.length); this.swap.set(false); }, 350); }, 3200);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
  scrollToFeatures() { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }
}
