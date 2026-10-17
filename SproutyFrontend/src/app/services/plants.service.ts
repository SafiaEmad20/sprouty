import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay, map } from 'rxjs';
import { API_URL, USE_MOCK } from '../core/config';
import { evaluate } from '../core/status';
import { LatestReading, NewReadingDto, Plant, PlantRequirement, PlantType, SensorReading } from '../models';
import { MOCK_PLANTS, MOCK_PLANT_TYPES, MOCK_REQUIREMENTS, makeReadings } from '../mock/mock-data';

@Injectable({ providedIn: 'root' })
export class PlantsService {
  private http = inject(HttpClient);
  private plants = [...MOCK_PLANTS];
  private extra: Record<string, SensorReading[]> = {};

  // ---- Plant types (library) ----
  getPlantTypes(): Observable<PlantType[]> {
    return USE_MOCK ? of(MOCK_PLANT_TYPES).pipe(delay(200)) : this.http.get<PlantType[]>(`${API_URL}/plant-types`);
  }
  getPlantType(id: string): Observable<{ type: PlantType; requirement: PlantRequirement }> {
    if (!USE_MOCK) return this.http.get<{ type: PlantType; requirement: PlantRequirement }>(`${API_URL}/plant-types/${id}`);
    return of({ type: MOCK_PLANT_TYPES.find(t => t.id === id)!, requirement: MOCK_REQUIREMENTS.find(r => r.plantTypeId === id)! }).pipe(delay(200));
  }

  // ---- My plants ----
  getMyPlants(): Observable<Plant[]> {
    return USE_MOCK ? of([...this.plants]).pipe(delay(200)) : this.http.get<Plant[]>(`${API_URL}/plants`);
  }
  getPlant(id: string): Observable<Plant> {
    return USE_MOCK ? of(this.plants.find(p => p.id === id)!) : this.http.get<Plant>(`${API_URL}/plants/${id}`);
  }
  addPlant(plantTypeId: string, nickname: string, imageUrl = ''): Observable<Plant> {
    if (!USE_MOCK) return this.http.post<Plant>(`${API_URL}/plants`, { plantTypeId, nickname, imageUrl });
    const p: Plant = { id: 'p' + Date.now(), userId: 'u1', plantTypeId, nickname, imageUrl, addedAt: new Date().toISOString() };
    this.plants.push(p);
    return of(p).pipe(delay(200));
  }
  deletePlant(id: string): Observable<void> {
    if (!USE_MOCK) return this.http.delete<void>(`${API_URL}/plants/${id}`);
    this.plants = this.plants.filter(p => p.id !== id);
    return of(void 0);
  }

  // ---- Readings ----
  private readingsFor(plantId: string): SensorReading[] {
    return [...makeReadings(plantId), ...(this.extra[plantId] ?? [])];
  }
  getReadings(plantId: string): Observable<SensorReading[]> {
    return USE_MOCK ? of(this.readingsFor(plantId)).pipe(delay(200)) : this.http.get<SensorReading[]>(`${API_URL}/plants/${plantId}/readings`);
  }
  /** Latest reading + computed status. The backend should return this from GET /plants/{id}/latest. */
  getLatest(plantId: string): Observable<LatestReading> {
    if (!USE_MOCK) return this.http.get<LatestReading>(`${API_URL}/plants/${plantId}/latest`);
    const plant = this.plants.find(p => p.id === plantId)!;
    const requirement = MOCK_REQUIREMENTS.find(r => r.plantTypeId === plant.plantTypeId)!;
    const all = this.readingsFor(plantId);
    const last = all[all.length - 1];
    // tiny jitter so the "live" updates are visible
    const reading = { ...last, moisture: +(last.moisture + (Math.random() - 0.5)).toFixed(1), temperature: +(last.temperature + (Math.random() - 0.5)).toFixed(1), recordedAt: new Date().toISOString() };
    return of({ reading, requirement, status: evaluate(plantId, reading, requirement) }).pipe(delay(150));
  }
  addReading(dto: NewReadingDto): Observable<SensorReading> {
    if (!USE_MOCK) return this.http.post<SensorReading>(`${API_URL}/readings`, dto);
    const r: SensorReading = { id: 'r' + Date.now(), sensorId: 's-' + dto.plantId, moisture: dto.moisture, temperature: dto.temperature, light: dto.light, recordedAt: new Date().toISOString() };
    (this.extra[dto.plantId] ??= []).push(r);
    return of(r).pipe(delay(200));
  }
}
