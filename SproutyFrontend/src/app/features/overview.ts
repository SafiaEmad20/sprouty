import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PlantsService } from '../services/plants.service';
import { apiErrorMessage } from '../core/api-error';
import { Plant, PlantStatus, PlantType } from '../models';
import { plantPhoto } from '../core/plant-images';
interface OverviewPlant { plant: Plant; type?: PlantType; status?: PlantStatus; }
@Component({ selector:'app-overview', imports:[RouterLink], template:`
  <div class="container overview-page"><div class="section-heading"><div><p class="eyebrow">YOUR GARDEN AT A GLANCE</p><h1>Good morning, {{firstName()}}.</h1><p class="muted">A little care goes a long way. Here's how your garden is doing.</p></div><a class="btn-primary" routerLink="/add-plant">＋ Add a plant</a></div>
    <section class="welcome-banner"><div><p class="eyebrow">A HAPPIER LIFE FOR YOUR PLANTS</p><h2>Happy plants.<br><em>Happier you.</em></h2><p>Every leaf tells a story. Let's make sure yours are thriving.</p><a routerLink="/plants" class="banner-link">Explore plant library →</a></div><img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85" alt="Sunlit collection of houseplants"></section>
    <div class="stat-grid"><div class="card stat-card"><small>TOTAL PLANTS</small><b>{{plants().length}}</b><span>In your garden</span></div><div class="card stat-card"><small>HAPPY & HEALTHY</small><b>{{healthyCount()}}</b><span>Looking their best</span></div><div class="card stat-card"><small>NEED A LITTLE LOVE</small><b>{{attentionCount()}}</b><span>We'll help you care</span></div></div>
    <div class="section-heading family-heading"><div><p class="eyebrow">YOUR GREEN FAMILY</p><h2>Growing together</h2></div><a routerLink="/my-plants" class="text-link">See all plants →</a></div>
    @if(error()){<p class="error">{{error()}}</p>}@if(loading()){<p class="muted">Checking on your plants…</p>}@if(!loading()&&!plants().length){<div class="card no-data"><div class="empty-photo"><img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80" alt="Sunlit green houseplants"></div><h2>Your garden is waiting.</h2><p class="muted">Choose your first plant and let Sprouty help you care for it.</p><a class="btn-primary" routerLink="/add-plant">Choose my first plant</a></div>}
    <div class="garden-grid">@for(r of plants().slice(0,3);track r.plant.id){<article class="card garden-card"><a [routerLink]="['/dashboard',r.plant.id]" class="garden-image"><img [src]="r.plant.imageUrl||plantPhoto(r.type)" [alt]="r.plant.nickname"></a><div class="garden-card-body"><div class="garden-card-title"><div><h3>{{r.plant.nickname}}</h3><small>{{r.type?.nameEn}}</small></div><span class="status-pill" [class.healthy]="r.status?.statusType==='Healthy'" [class.attention]="r.status && !['Healthy','NoData'].includes(r.status.statusType)">{{label(r.status)}}</span></div><p class="plant-voice">{{r.status?.message||'Waiting for the first reading.'}}</p><div class="garden-card-actions"><a [routerLink]="['/dashboard',r.plant.id]">View details</a><a [routerLink]="['/edit-plant',r.plant.id]">Edit</a></div></div></article>}</div>
  </div>`,
})
export class Overview {
  plantPhoto=plantPhoto; private svc=inject(PlantsService);plants=signal<OverviewPlant[]>([]);loading=signal(true);error=signal('');
  healthyCount=computed(()=>this.plants().filter(x=>x.status?.statusType==='Healthy').length);attentionCount=computed(()=>this.plants().filter(x=>x.status&&!['Healthy','NoData'].includes(x.status.statusType)).length);
  firstName=computed(()=>{try{return(JSON.parse(localStorage.getItem('user')||'{}')?.name||'there').split(' ')[0];}catch{return'there';}});
  constructor(){forkJoin([this.svc.getMyPlants(),this.svc.getPlantTypes()]).subscribe({next:([list,types])=>{const rows=list.map(plant=>({plant,type:types.find(t=>t.id===plant.plantTypeId)}));this.plants.set(rows);this.loading.set(false);rows.forEach(row=>this.svc.getLatest(row.plant.id).pipe(catchError(()=>of(null))).subscribe(l=>{if(l)this.plants.update(old=>old.map(x=>x.plant.id===row.plant.id?{...x,status:l.status}:x));}));},error:e=>{this.error.set(apiErrorMessage(e,'Could not load your garden.'));this.loading.set(false);}});}
  label(s?:PlantStatus){if(!s||s.statusType==='NoData')return'Waiting';return s.statusType==='Healthy'?'Healthy':'Needs care';}
}
