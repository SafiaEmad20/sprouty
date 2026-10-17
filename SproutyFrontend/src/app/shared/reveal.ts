import { Directive, ElementRef, OnDestroy, OnInit, inject, input, numberAttribute } from '@angular/core';

/** Fades an element in when it scrolls into view. Usage: <div reveal revealDelay="150"> */
@Directive({ selector: '[reveal]', host: { class: 'reveal', '[style.transition-delay.ms]': 'delay()' } })
export class Reveal implements OnInit, OnDestroy {
  delay = input(0, { alias: 'revealDelay', transform: numberAttribute });
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private io?: IntersectionObserver;
  ngOnInit() {
    const e = this.el.nativeElement;
    if (!('IntersectionObserver' in window)) { e.classList.add('in'); return; }
    this.io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { e.classList.add('in'); this.io?.disconnect(); } }, { threshold: 0.15 });
    this.io.observe(e);
  }
  ngOnDestroy() { this.io?.disconnect(); }
}
