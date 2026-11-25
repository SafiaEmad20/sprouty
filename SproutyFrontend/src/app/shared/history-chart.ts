import { Component, computed, input } from '@angular/core';
import { SensorReading } from '../models';
@Component({
  selector:'app-history-chart', template:`
    <svg viewBox="0 0 600 200" preserveAspectRatio="none" role="img" [attr.aria-label]="label() + ' history from ' + firstLabel() + ' to ' + lastLabel()">
      <line x1="0" y1="50" x2="600" y2="50" class="grid-line"/><line x1="0" y1="100" x2="600" y2="100" class="grid-line"/><line x1="0" y1="150" x2="600" y2="150" class="grid-line"/>
      <rect x="0" [attr.y]="band().y" width="600" [attr.height]="band().h" class="ideal-band"/>
      @if(points()){<polyline [attr.points]="points()" fill="none" class="chart-line" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>}
    </svg>
    <div class="muted axis"><span>{{firstLabel()}}</span><span>{{lastLabel()}}</span></div>`,
  styles:[`svg{width:100%;height:210px;display:block;background:var(--surface);border-radius:12px;overflow:visible}.grid-line{stroke:var(--line);stroke-dasharray:4 5}.ideal-band{fill:var(--surface-sage);opacity:.75}.chart-line{stroke:var(--forest)}.axis{display:flex;justify-content:space-between;font-size:10px;margin-top:8px}`],
})
export class HistoryChart {
  data=input.required<SensorReading[]>();metric=input.required<'moisture'|'temperature'|'light'>();min=input.required<number>();max=input.required<number>();label=input('Reading');
  firstLabel=computed(()=>this.data().length?this.format(this.data()[0].recordedAt):'No readings');
  lastLabel=computed(()=>this.data().length?this.format(this.data()[this.data().length-1].recordedAt):'Waiting');
  private format(value:string){const d=new Date(value);return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('en',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(d);}
  private range=computed(()=>{const v=this.data().map(d=>d[this.metric()]);const lo=Math.min(this.min(),...v)-5,hi=Math.max(this.max(),...v)+5;return{lo,hi};});
  private y(v:number){const{lo,hi}=this.range();return 200-((v-lo)/(hi-lo))*200;}
  band=computed(()=>({y:this.y(this.max()),h:this.y(this.min())-this.y(this.max())}));
  points=computed(()=>{const d=this.data();return d.map((r,i)=>`${(i/Math.max(1,d.length-1))*600},${this.y(r[this.metric()])}`).join(' ');});
}
