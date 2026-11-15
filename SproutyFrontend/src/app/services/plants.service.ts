import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map, shareReplay } from 'rxjs';
import { API_URL, USE_MOCK, USE_MOCK_PLANT_TYPES } from '../core/config';
import { evaluate } from '../core/status';
import { DEFAULT_REQUIREMENT, mapPlantType } from '../core/plant-type-mapper';
import { ApiPlantType, LatestReading, NewReadingDto, Plant, PlantRequirement, PlantType, SensorReading } from '../models';
import { MOCK_PLANT_TYPES, MOCK_REQUIREMENTS, makeReadings } from '../mock/mock-data';
import { userKey } from '../core/user-storage';

interface TypeData { types: PlantType[]; reqs: Map<string, PlantRequirement>; }

@Injectable({ providedIn: 'root' })
export class PlantsService {
  private http = inject(HttpClient);
  private extra: Record<string, SensorReading[]> = {};
  private typeData$?: Observable<TypeData>;

  // Plant types are loaded once (real API or mock) and shared; the ideal ranges come with them.
  private loadTypes(): Observable<TypeData> {
    return (this.typeData$ ??= (USE_MOCK_PLANT_TYPES
      ? of<TypeData>({ types: MOCK_PLANT_TYPES, reqs: new Map(MOCK_REQUIREMENTS.map(r => [r.plantTypeId, r] as [string, PlantRequirement])) }).pipe(delay(200))
      : this.http.get<ApiPlantType[]>(`${API_URL}/plant-types`).pipe(map(list => {
          const mapped = list.map(mapPlantType);
          return { types: mapped.map(m => m.type), reqs: new Map(mapped.map(m => [m.type.id, m.requirement] as [string, PlantRequirement])) } as TypeData;
        }))
    ).pipe(shareReplay(1)));
  }
  // Mock plants are saved per account in localStorage, so a new account starts with no plants.
  private stored(): Plant[] { try { return JSON.parse(localStorage.getItem(userKey('plants')) ?? '[]'); } catch { return []; } }
  private store(list: Plant[]) { try { localStorage.setItem(userKey('plants'), JSON.stringify(list)); } catch { /* storage full: photo is lost on refresh */ } }
  private reqFor(plantId: string, d: TypeData): PlantRequirement {
    const p = this.stored().find(x => x.id === plantId);
    return (p && d.reqs.get(p.plantTypeId)) || DEFAULT_REQUIREMENT;
  }

  // ---- Plant types (library) : REAL ----
  getPlantTypes(): Observable<PlantType[]> { return this.loadTypes().pipe(map(d => d.types)); }
  getPlantType(id: string): Observable<{ type: PlantType; requirement: PlantRequirement }> {
    if (USE_MOCK_PLANT_TYPES) return this.loadTypes().pipe(map(d => ({ type: d.types.find(t => t.id === id)!, requirement: d.reqs.get(id)! })));
    return this.http.get<ApiPlantType>(`${API_URL}/plant-types/${id}`).pipe(map(mapPlantType));
  }

  // ---- My plants : mock until the backend has /api/plants ----
  getMyPlants(): Observable<Plant[]> {
    return USE_MOCK ? this.loadTypes().pipe(map(() => this.stored())) : this.http.get<Plant[]>(`${API_URL}/plants`);
  }
  getPlant(id: string): Observable<Plant> {
    if (!USE_MOCK) return this.http.get<Plant>(`${API_URL}/plants/${id}`);
    return this.loadTypes().pipe(map(() => {
      const p = this.stored().find(x => x.id === id);
      if (!p) throw new Error('Plant not found');
      return p;
    }));
  }
  addPlant(plantTypeId: string, nickname: string, imageUrl = ''): Observable<Plant> {
    if (!USE_MOCK) return this.http.post<Plant>(`${API_URL}/plants`, { plantTypeId, nickname, imageUrl });
    const p: Plant = { id: 'p' + Date.now(), userId: 'u1', plantTypeId, nickname, imageUrl, addedAt: new Date().toISOString() };
    this.store([...this.stored(), p]);
    return of(p).pipe(delay(200));
  }
  deletePlant(id: string): Observable<void> {
    if (!USE_MOCK) return this.http.delete<void>(`${API_URL}/plants/${id}`);
    this.store(this.stored().filter(p => p.id !== id));
    return of(void 0);
  }

  // ---- Readings : mock until the backend exposes them per plant ----
  private readingsFor(plantId: string, q: PlantRequirement): SensorReading[] {
    return [...makeReadings(plantId, q), ...(this.extra[plantId] ?? [])];
  }
  getReadings(plantId: string): Observable<SensorReading[]> {
    if (!USE_MOCK) return this.http.get<SensorReading[]>(`${API_URL}/plants/${plantId}/readings`);
    return this.loadTypes().pipe(map(d => this.readingsFor(plantId, this.reqFor(plantId, d))));
  }
  /** Latest reading + computed status. The backend should return this from GET /plants/{id}/latest. */
  getLatest(plantId: string): Observable<LatestReading> {
    if (!USE_MOCK) return this.http.get<LatestReading>(`${API_URL}/plants/${plantId}/latest`);
    return this.loadTypes().pipe(map(d => {
      const requirement = this.reqFor(plantId, d);
      const all = this.readingsFor(plantId, requirement), last = all[all.length - 1];
      const reading = { ...last, moisture: +(last.moisture + (Math.random() - 0.5)).toFixed(1), temperature: +(last.temperature + (Math.random() - 0.5)).toFixed(1), recordedAt: new Date().toISOString() };
      return { reading, requirement, status: evaluate(plantId, reading, requirement) };
    }), delay(150));
  }
  addReading(dto: NewReadingDto): Observable<SensorReading> {
    if (!USE_MOCK) return this.http.post<SensorReading>(`${API_URL}/readings`, dto);
    const r: SensorReading = { id: 'r' + Date.now(), sensorId: 's-' + dto.plantId, moisture: dto.moisture, temperature: dto.temperature, light: dto.light, recordedAt: new Date().toISOString() };
    (this.extra[dto.plantId] ??= []).push(r);
    return of(r).pipe(delay(200));
  }
}
