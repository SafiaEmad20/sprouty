import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlantsService } from '../services/plants.service';
import { apiErrorMessage } from '../core/api-error';
import { PlantType } from '../models';
import { plantPhoto } from '../core/plant-images';
@Component({ selector:'app-plant-library', imports:[RouterLink], template:`
  <div class="container library-page"><p class="eyebrow">A GREENER HOME STARTS HERE</p><h1>Discover your <em>green friends.</em></h1><section class="library-banner"><div><p class="eyebrow">A LITTLE MORE GREEN, EVERY DAY</p><h2>A greener home starts<br>with one little plant.</h2><p>Find a plant that fits your space, your light and your kind of care.</p></div><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85" alt="Green plants in a bright home"></section>
    <div class="library-toolbar"><input type="search" placeholder="Search your next green friend…" aria-label="Search plants" (input)="q.set($any($event.target).value)"><div class="tabs">@for(c of categories();track c){<button [class.selected]="cat()===c" (click)="cat.set(c)">{{c}}</button>}</div></div>
    @if(error()){<div class="card"><p class="error">{{error()}}</p><button class="btn-outline" (click)="load()">Try again</button></div>} @else if(loading()){<p class="muted">Finding your green friends…</p>}
    @for(g of groups();track g.name){<div class="library-category"><div class="section-heading"><h2>{{g.name}}</h2><span class="muted">{{g.items.length}} plants</span></div><div class="library-grid">@for(t of g.items;track t.id){<article class="card library-card"><button class="library-open" (click)="selected.set(t)"><span class="library-image">@if(t.imageUrl){<img [src]="t.imageUrl" [alt]="t.nameEn">}@else{<img [src]="fallbackPhoto(t)" [alt]="t.nameEn" loading="lazy">}</span><span class="library-card-copy"><span><b>{{t.nameEn}}</b><small>{{t.nameAr}}</small></span><span class="round-arrow">↗</span></span></button></article>}</div></div>} @empty {@if(!loading()&&!error()){<div class="card no-data"><div class="empty-photo"><img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80" alt="Sunlit green houseplants"></div><h2>No plants found</h2><p class="muted">Try another name or category.</p></div>}}
  </div>
  @if(selected();as t){<div class="overlay" (click)="selected.set(null)"><section class="card plant-modal" role="dialog" aria-modal="true" (click)="$event.stopPropagation()"><button class="modal-close" (click)="selected.set(null)" aria-label="Close">×</button>@if(t.imageUrl){<img [src]="t.imageUrl" [alt]="t.nameEn">}@else{<img [src]="fallbackPhoto(t)" [alt]="t.nameEn">}<p class="eyebrow">MEET THIS PLANT</p><h2>{{t.nameEn}}</h2><p class="muted">{{t.nameAr}} · {{t.category}}</p><p>A new little green friend for your home. Add it to your garden and Sprouty will help you understand what it needs.</p><a class="btn-primary" [routerLink]="['/plants',t.id]" (click)="selected.set(null)">Add to my garden ↗</a></section></div>}
  `,
})
export class PlantLibrary {
  private svc=inject(PlantsService);private route=inject(ActivatedRoute);types=signal<PlantType[]>([]);selected=signal<PlantType|null>(null);q=signal(this.route.snapshot.queryParamMap.get('q')??'');cat=signal('All');loading=signal(true);error=signal('');
  categories=computed(()=>['All',...new Set(this.types().map(t=>t.category))]);
  groups=computed(()=>{const list=this.types().filter(t=>(this.cat()==='All'||t.category===this.cat())&&(t.nameEn+' '+t.nameAr).toLowerCase().includes(this.q().toLowerCase()));return [...new Set(list.map(t=>t.category))].map(name=>({name,items:list.filter(t=>t.category===name)}));});
  constructor(){this.load();}
  fallbackPhoto(type:PlantType){return plantPhoto(type);}
  load(){this.loading.set(true);this.error.set('');this.svc.getPlantTypes().subscribe({next:r=>{this.types.set(r);this.loading.set(false);},error:e=>{this.loading.set(false);this.error.set(apiErrorMessage(e,'Could not load the plant library.'));}});}
}
