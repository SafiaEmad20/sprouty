// Models mirror the ERD (camelCase, as ASP.NET Core serializes JSON by default).
export interface User { id: string; name: string; email: string; }
export interface AuthResponse { token: string; user: User; }

export interface PlantType {
  id: string; nameAr: string; nameEn: string; category: string; imageUrl: string;
  emoji?: string;
  // NOT in the ERD yet — requested from backend:
  careNotes: string; careSteps: string[]; sunSchedule: string;
}
export interface PlantRequirement {
  id: string; plantTypeId: string;
  minMoisture: number; maxMoisture: number;
  minTemperature: number; maxTemperature: number;
  minLight: number; maxLight: number;
}
export interface Plant { id: string; userId: string; plantTypeId: string; nickname: string; imageUrl: string; addedAt: string; }
export interface SensorReading { id: string; sensorId: string; moisture: number; temperature: number; light: number; recordedAt: string; }

export type StatusType = 'Healthy' | 'NeedsWater' | 'TooMuchWater' | 'TooHot' | 'TooCold' | 'NeedsLight' | 'TooMuchLight';
export interface PlantStatus { id: string; plantId: string; statusType: StatusType; message: string; computedAt: string; }

export interface AppNotification { id: string; plantId: string; title: string; message: string; type: StatusType; isRead: boolean; createdAt: string; }

export interface LatestReading { reading: SensorReading; status: PlantStatus; requirement: PlantRequirement; }
export interface NewReadingDto { plantId: string; moisture: number; temperature: number; light: number; }
