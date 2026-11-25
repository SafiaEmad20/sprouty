import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PlantsService } from '../services/plants.service';
import { apiErrorMessage } from '../core/api-error';
import { Plant, PlantStatus, PlantType } from '../models';
import { plantPhoto } from '../core/plant-images';
interface Row { plant: Plant; type?: PlantType; status?: PlantStatus; }
@Component({ selector:'app-my-plants', imports:[RouterLink], template:`
  <div class="container my-plants-page"><div class="section-heading"><div><p class="eyebrow">ALL THE LITTLE THINGS YOU GROW</p><h1>Your green family.</h1><p class="muted">Every plant has its own little personality. Here's yours.</p></div><a class="btn-primary" routerLink="/add-plant">＋ Add a plant</a></div>
    <div class="garden-grid">@for(r of rows();track r.plant.id){<article class="card garden-card"><a [routerLink]="['/dashboard',r.plant.id]" class="garden-image"><img [src]="r.plant.imageUrl||plantPhoto(r.type)" [alt]="r.plant.nickname"></a><div class="garden-card-body"><div class="garden-card-title"><div><h3>{{r.plant.nickname}}</h3><small>{{r.type?.nameEn}}</small></div><span class="status-pill" [class.healthy]="r.status?.statusType==='Healthy'" [class.attention]="r.status && !['Healthy','NoData'].includes(r.status.statusType)">{{label(r.status)}}</span></div><p class="plant-voice">{{r.status?.message||'Waiting for the first reading.'}}</p><div class="garden-card-actions"><a [routerLink]="['/dashboard',r.plant.id]">View details</a><a [routerLink]="['/edit-plant',r.plant.id]">Edit</a><button (click)="remove(r.plant)">Remove</button></div></div></article>}</div>
    @if(loading()){<p class="muted">Loading your plants…</p>}@if(error()){<p class="error">{{error()}}</p>}@if(!loading()&&!rows().length&&!error()){<div class="card no-data"><div class="empty-photo"><img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=80" alt="Sunlit green houseplants"></div><h2>Your garden is waiting.</h2><p class="muted">Choose your first plant and let Sprouty help you care for it.</p><a class="btn-primary" routerLink="/add-plant">Choose my first plant</a></div>}
  </div>`,
})
export class MyPlants {
  plantPhoto=plantPhoto; private svc=inject(PlantsService);private route=inject(ActivatedRoute);rows=signal<Row[]>([]);loading=signal(true);error=signal('');
  constructor(){this.route.queryParamMap.subscribe(params=>this.load(params.get('q')??''));}
  label(s?:PlantStatus){if(!s||s.statusType==='NoData')return'Waiting';return s.statusType==='Healthy'?'Healthy':'Needs care';}
  remove(p:Plant){if(!confirm(`Remove ${p.nickname} and its history?`))return;this.svc.deletePlant(p.id).subscribe({next:()=>this.load(),error:e=>this.error.set(apiErrorMessage(e,'Could not remove this plant.'))});}
  load(search=''){this.error.set('');this.loading.set(true);forkJoin([this.svc.getMyPlants(search),this.svc.getPlantTypes()]).subscribe({next:([list,types])=>{const q=search.trim().toLocaleLowerCase();const rows=list.map(plant=>({plant,type:types.find(t=>t.id===plant.plantTypeId)})).filter(row=>!q||(row.plant.nickname+' '+(row.type?.nameEn??'')+' '+(row.type?.nameAr??'')).toLocaleLowerCase().includes(q));this.rows.set(rows);this.loading.set(false);rows.forEach(row=>this.svc.getLatest(row.plant.id).pipe(catchError(()=>of(null))).subscribe(l=>{if(l)this.rows.update(old=>old.map(x=>x.plant.id===row.plant.id?{...x,status:l.status}:x));}));},error:e=>{this.error.set(apiErrorMessage(e,'Could not load your plants.'));this.loading.set(false);}});}
}
