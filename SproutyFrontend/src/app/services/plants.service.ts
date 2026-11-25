import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { API_URL } from '../core/config';
import { ApiAddReadingResponse, ApiLatestReading, ApiPlantType, ApiSensorReading, LatestReading, NewReadingDto, Plant, PlantRequirement, PlantType, SensorReading } from '../models';
import { mapPlantType } from '../core/plant-type-mapper';
import { lightPercentToRaw, mapReading, mapRequirement, mapStatus } from '../core/status';

interface TypeData { types: PlantType[]; requirements: Map<string, PlantRequirement | null>; }
@Injectable({ providedIn: 'root' })
export class PlantsService {
  private http = inject(HttpClient);
  private typeData$?: Observable<TypeData>;
  private loadTypes(): Observable<TypeData> {
    return this.typeData$ ??= this.http.get<ApiPlantType[]>(`${API_URL}/plant-types`).pipe(
      map(list => { const mapped = list.map(mapPlantType); return { types: mapped.map(x => x.type), requirements: new Map(mapped.map(x => [x.type.id, x.requirement] as [string, PlantRequirement | null])) }; }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }
  getPlantTypes(): Observable<PlantType[]> { return this.loadTypes().pipe(map(x => x.types)); }
  getPlantType(id: string): Observable<{ type: PlantType; requirement: PlantRequirement | null }> {
    return this.http.get<ApiPlantType>(`${API_URL}/plant-types/${id}`).pipe(map(mapPlantType));
  }
  searchPlantTypes(q: string): Observable<PlantType[]> {
    const query = q.trim();
    if (!query) return this.getPlantTypes();
    return this.getPlantTypes().pipe(map(list => list.filter(t => (t.nameEn + ' ' + t.nameAr + ' ' + t.category).toLocaleLowerCase().includes(query.toLocaleLowerCase()))));
  }
  getMyPlants(_search = ''): Observable<Plant[]> {
    // The current API list endpoint has no search query; My Plants filters the joined plant/type data locally.
    return this.http.get<Plant[]>(`${API_URL}/plants`);
  }
  getPlant(id: string): Observable<Plant> { return this.http.get<Plant>(`${API_URL}/plants/${id}`); }
  addPlant(plantTypeId: string, nickname: string, imageUrl = ''): Observable<Plant> {
    return this.http.post<Plant>(`${API_URL}/plants`, { plantTypeId, nickname, imageUrl: imageUrl || null });
  }
  updatePlant(id: string, plantTypeId: string, nickname: string, imageUrl = ''): Observable<Plant> {
    return this.http.put<Plant>(`${API_URL}/plants/${id}`, { plantTypeId, nickname, imageUrl: imageUrl || null });
  }
  deletePlant(id: string): Observable<void> { return this.http.delete<void>(`${API_URL}/plants/${id}`); }
  getReadings(plantId: string, limit = 100): Observable<SensorReading[]> {
    return this.http.get<ApiSensorReading[]>(`${API_URL}/plants/${plantId}/readings`, { params: { limit } }).pipe(map(rows => rows.map(mapReading)));
  }
  getLatest(plantId: string): Observable<LatestReading> {
    return this.http.get<ApiLatestReading>(`${API_URL}/plants/${plantId}/latest`).pipe(map(r => ({
      reading: r.reading ? mapReading(r.reading) : null,
      requirement: mapRequirement(r.requirement),
      status: mapStatus(plantId, r.status),
    })));
  }
  addReading(plantId: string, dto: NewReadingDto): Observable<LatestReading> {
    const body = { moisture: dto.moisture, temperature: dto.temperature, humidity: dto.humidity, light: lightPercentToRaw(dto.light) };
    return this.http.post<ApiAddReadingResponse>(`${API_URL}/plants/${plantId}/readings`, body).pipe(map(r => ({
      reading: mapReading(r.reading), requirement: null, status: mapStatus(plantId, r.status),
    })));
  }
}
