
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <main class="home-v3">

      <section class="home-hero-v3">
        <div class="home-hero-copy">
          <p class="eyebrow">
            <span class="eyebrow-rule"></span>
            A MORE THOUGHTFUL WAY TO GROW
          </p>

          <h1>
            Know what they need.<br>
            <em>Love how they grow.</em>
          </h1>

          <p class="home-lead">
            A good plant day starts with understanding the little things.
            Sprouty brings your plant care, sensor readings and gentle guidance
            together — so caring for your green space feels simple, not like guesswork.
          </p>

          <div class="home-actions">
            <a class="btn-primary"
               [routerLink]="auth.isLoggedIn ? '/overview' : '/register'">
              {{ auth.isLoggedIn ? 'Open my garden' : 'Start your garden' }}
              <span aria-hidden="true">→</span>
            </a>

            <a class="btn-outline" href="#how-it-works">
              Discover Sprouty
            </a>
          </div>

          <div class="home-proof">
            <span class="proof-mark">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.5 4.5C11 4.8 5 8 5 14c0 3.2 2 5.5 5 5.5 6.1 0 9.3-6.3 9.5-15Z"/>
                <path d="M4 21c3-5 6.7-8.3 11.5-11"/>
              </svg>
            </span>

            <span>
              <b>Care that makes sense.</b>
              <small>Clear insights. More confident plant care.</small>
            </span>
          </div>
        </div>

        <div class="home-hero-visual">
          <img
            src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1500&q=90"
            alt="A sunlit indoor garden filled with lush green plants"
          >

          <div class="floating-note note-top">
            <span class="note-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 3v18M5 8c0 5 3 8 7 8s7-3 7-8"/>
              </svg>
            </span>
            <span>
              <small>A little reminder</small>
              <b>Every plant has its own rhythm.</b>
            </span>
          </div>

          <div class="floating-note note-bottom">
            <span class="health-dot"></span>
            <span>
              <small>Your garden, made clearer</small>
              <b>Understand before you water.</b>
            </span>
          </div>
        </div>
      </section>

      <section class="home-statement" id="how-it-works">
        <p class="eyebrow">PLANT CARE, WITH A LITTLE MORE CLARITY</p>

        <h2>
          Less second-guessing.<br>
          <em>More moments of growth.</em>
        </h2>

        <p>
          Whether you're learning the name of a new plant or checking on one
          you've had for years, Sprouty helps turn plant-care information
          into practical next steps.
        </p>
      </section>

      <section class="home-steps-v3" id="features">

        <article class="home-step-card">
          <span class="step-number">01 / ADD</span>

          <div class="step-art step-art-one">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=85"
              alt="Green plant growing in brown soil"
            >
          </div>

          <h3>Make room for green.</h3>

          <p>
            Add a plant from the library, give it a name and make your garden feel like yours.
          </p>
        </article>

        <article class="home-step-card">
          <span class="step-number">02 / UNDERSTAND</span>

          <div class="step-art step-art-two">
            <img
              src="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?auto=format&fit=crop&w=900&q=85"
              alt="Green bonsai tree against a dark background"
            >
          </div>

          <h3>Listen to the little signals.</h3>

          <p>
            Keep an eye on available sensor readings and see how they compare with your plant's care needs.
          </p>
        </article>

        <article class="home-step-card">
          <span class="step-number">03 / CARE</span>

          <div class="step-art step-art-three">
            <img
              src="https://plus.unsplash.com/premium_photo-1675864662842-6efc0ef31f67?auto=format&fit=crop&w=900&q=85"
              alt="A green plant with large leaves in front of a pink wall"
            >
          </div>

          <h3>Give care with confidence.</h3>

          <p>
            Use clear status updates and helpful guidance to decide what deserves your attention.
          </p>
        </article>

      </section>

      <section class="home-editorial-v3">
        <div class="editorial-image">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=90"
            alt="Fresh green leaves in natural light"
          >
        </div>

        <div class="editorial-copy">
          <p class="eyebrow">A HEALTHIER RELATIONSHIP WITH YOUR PLANTS</p>

          <h2>
            Because good care<br>
            starts with <em>noticing.</em>
          </h2>

          <p>
            Too much water, too little light, a change in temperature —
            small details can make a big difference. Sprouty brings the
            information into one calm space, helping you pay attention
            without feeling overwhelmed.
          </p>

          <a class="text-link" routerLink="/plants">
            Find a plant to grow with →
          </a>
        </div>
      </section>

      <section class="home-quote-v3">
        <span class="quote-leaf">
          <svg viewBox="0 0 32 32">
            <path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/>
            <path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/>
          </svg>
        </span>

        <p>
          “You don't need a perfect green thumb.<br>
          You just need a little curiosity, and room to grow.”
        </p>

        <small>THE SPROUTY WAY</small>
      </section>

     
        <section class="home-final-v3">
          <div>
            <p class="eyebrow">YOUR NEXT LITTLE BEGINNING</p>

            <h2>
              Let's make your space<br>
              <em>a little greener.</em>
            </h2>

            <p>
              Start with one plant. Learn as you go. Let every small step count.
            </p>

            <a
              class="btn-primary"
              [routerLink]="auth.isLoggedIn ? '/overview' : '/register'"
            >
              {{ auth.isLoggedIn ? 'Visit my garden' : 'Create your free garden' }}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div class="final-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1747644412733-003313c88f1f?auto=format&fit=crop&w=1400&q=90"
              alt="A beautiful potted plant in a bright and peaceful living room"
              loading="lazy"
            >
          </div>
        </section>


      <footer class="public-footer">
        <a class="public-brand" routerLink="/">
          <span class="brand-symbol" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M25.5 5.5C15 5.7 7.1 9.2 6.2 17.1c-.5 4.2 2.3 7.2 6.2 7.2 8.1 0 12.8-8.2 13.1-18.8Z"/>
              <path d="M7 27c3.7-6.4 8.4-10.6 14.4-13.8"/>
            </svg>
          </span>
          SPROUTY
        </a>

        <span>Thoughtful plant care, one little step at a time.</span>

        <a routerLink="/login">Log in</a>
      </footer>

    </main>
  `
})
export class Home {
  auth = inject(AuthService);
}
